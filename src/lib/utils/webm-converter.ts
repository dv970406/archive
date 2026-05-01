// 브라우저에서 지원하는 WebM mimeType 선택
const getSupportedMimeType = (): string | undefined => {
	const candidates = [
		"video/webm;codecs=vp9",
		"video/webm;codecs=vp8",
		"video/webm",
	];
	return candidates.find((type) => MediaRecorder.isTypeSupported(type));
};

interface ITier {
	maxLongSide: number;
	fps: number;
}

// 화질 계단. 인덱스가 커질수록 더 강하게 축소됨
const TIERS: readonly ITier[] = [
	{ maxLongSide: 1280, fps: 30 },
	{ maxLongSide: 720, fps: 30 },
	{ maxLongSide: 480, fps: 24 },
	{ maxLongSide: 360, fps: 24 },
	{ maxLongSide: 360, fps: 15 },
];

const resolveTier = (bitsPerSecond: number): ITier => {
	const kbps = bitsPerSecond / 1000;
	if (kbps >= 500) return TIERS[0];
	if (kbps >= 200) return TIERS[1];
	if (kbps >= 100) return TIERS[2];
	if (kbps >= 50) return TIERS[3];
	return TIERS[4];
};

const dropTier = (tier: ITier): ITier => {
	const idx = TIERS.findIndex(
		(t) => t.maxLongSide === tier.maxLongSide && t.fps === tier.fps,
	);
	if (idx < 0 || idx >= TIERS.length - 1) return TIERS[TIERS.length - 1];
	return TIERS[idx + 1];
};

// 종횡비 유지 축소 (업스케일 금지, 인코더 호환성 위해 짝수 보정)
const scaleDimensions = (
	srcWidth: number,
	srcHeight: number,
	maxLongSide: number,
) => {
	const longSide = Math.max(srcWidth, srcHeight);
	if (longSide <= maxLongSide) {
		return { width: srcWidth, height: srcHeight };
	}
	const ratio = maxLongSide / longSide;
	const width = Math.max(2, Math.round((srcWidth * ratio) / 2) * 2);
	const height = Math.max(2, Math.round((srcHeight * ratio) / 2) * 2);
	return { width, height };
};

// MediaSource 기반 webm 등에서 duration === Infinity인 케이스 복구
const DURATION_FALLBACK_SEC = 60;
const PROBE_MASTER_TIMEOUT_MS = 10_000;
const PROBE_SEEK_TIMEOUT_MS = 3_000;

const probeDuration = (file: File): Promise<number> =>
	new Promise((resolve) => {
		const video = document.createElement("video");
		const objectUrl = URL.createObjectURL(file);
		let seekTimeoutId = 0;
		let masterTimeoutId = 0;
		let done = false;

		const finish = (value: number) => {
			if (done) return;
			done = true;
			clearTimeout(seekTimeoutId);
			clearTimeout(masterTimeoutId);
			video.src = "";
			URL.revokeObjectURL(objectUrl);
			resolve(value);
		};

		const tryResolve = () => {
			if (Number.isFinite(video.duration) && video.duration > 0) {
				finish(video.duration);
			}
		};

		// 손상된 파일 등으로 onloadedmetadata·onerror 둘 다 안 뜨는 경우 대비
		masterTimeoutId = window.setTimeout(
			() => finish(DURATION_FALLBACK_SEC),
			PROBE_MASTER_TIMEOUT_MS,
		);

		video.preload = "metadata";
		video.muted = true;
		video.src = objectUrl;

		video.onloadedmetadata = () => {
			if (Number.isFinite(video.duration) && video.duration > 0) {
				finish(video.duration);
				return;
			}
			// Infinity/NaN 복구: 끝까지 시크 → duration 갱신 유도
			seekTimeoutId = window.setTimeout(
				() => finish(DURATION_FALLBACK_SEC),
				PROBE_SEEK_TIMEOUT_MS,
			);
			video.ondurationchange = tryResolve;
			video.ontimeupdate = tryResolve;
			video.currentTime = Number.MAX_SAFE_INTEGER;
		};

		video.onerror = () => finish(DURATION_FALLBACK_SEC);
	});

interface IEncodeAttempt {
	bitsPerSecond: number;
	tier: ITier;
}

// 1회 인코딩. 매 시도마다 video/canvas/MediaRecorder 리소스를 독립 생성·해제
const encodeOnce = (
	file: File,
	attempt: IEncodeAttempt,
	mimeType: string,
	durationSec: number,
): Promise<Blob> =>
	new Promise((resolve, reject) => {
		const video = document.createElement("video");
		const objectUrl = URL.createObjectURL(file);
		let rafId = 0;
		let timeoutId = 0;
		let settled = false;
		let stream: MediaStream | null = null;

		const cleanup = () => {
			cancelAnimationFrame(rafId);
			clearTimeout(timeoutId);
			if (stream) {
				for (const track of stream.getTracks()) track.stop();
			}
			video.pause();
			video.src = "";
			URL.revokeObjectURL(objectUrl);
		};

		const fail = (err: Error) => {
			if (settled) return;
			settled = true;
			cleanup();
			reject(err);
		};

		const succeed = (blob: Blob) => {
			if (settled) return;
			settled = true;
			cleanup();
			resolve(blob);
		};

		video.src = objectUrl;
		video.muted = true;
		video.playsInline = true;

		video.onerror = () => fail(new Error("비디오 파일을 로드할 수 없습니다."));

		video.onloadedmetadata = () => {
			const { width, height } = scaleDimensions(
				video.videoWidth,
				video.videoHeight,
				attempt.tier.maxLongSide,
			);

			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext("2d");
			if (!ctx) {
				fail(new Error("Canvas context를 생성할 수 없습니다."));
				return;
			}

			stream = canvas.captureStream(attempt.tier.fps);
			let recorder: MediaRecorder;
			try {
				recorder = new MediaRecorder(stream, {
					mimeType,
					videoBitsPerSecond: Math.max(
						50_000,
						Math.floor(attempt.bitsPerSecond),
					),
				});
			} catch (err) {
				fail(
					err instanceof Error
						? err
						: new Error("MediaRecorder 생성에 실패했습니다."),
				);
				return;
			}

			const chunks: Blob[] = [];
			recorder.ondataavailable = (e) => {
				if (e.data.size > 0) chunks.push(e.data);
			};
			recorder.onstop = () => {
				succeed(new Blob(chunks, { type: "video/webm" }));
			};
			recorder.onerror = () => fail(new Error("녹화 중 오류가 발생했습니다."));

			// 목표 fps에 맞춰 drawImage 스로틀 (rAF는 60fps라 그대로 두면 중복 프레임 유발)
			const frameInterval = 1 / attempt.tier.fps;
			let lastDrawnTime = Number.NEGATIVE_INFINITY;

			const drawFrame = () => {
				const t = video.currentTime;
				if (t - lastDrawnTime >= frameInterval) {
					ctx.drawImage(video, 0, 0, width, height);
					lastDrawnTime = t;
				}
				if (!video.ended) {
					rafId = requestAnimationFrame(drawFrame);
				}
			};

			video.onended = () => {
				cancelAnimationFrame(rafId);
				ctx.drawImage(video, 0, 0, width, height);
				if (recorder.state === "recording") recorder.stop();
			};

			// onended 누락 대비 안전 타임아웃 (실제 재생 길이 + 3초)
			timeoutId = window.setTimeout(
				() => {
					if (recorder.state === "recording") recorder.stop();
				},
				(durationSec + 3) * 1000,
			);

			video
				.play()
				.then(() => {
					// 짧은 영상에서도 chunks가 비지 않도록 250ms 슬라이스로 플러시
					recorder.start(250);
					rafId = requestAnimationFrame(drawFrame);
				})
				.catch((err) =>
					fail(
						err instanceof Error
							? err
							: new Error("영상 재생을 시작할 수 없습니다."),
					),
				);
		};
	});

interface IConvertOptions {
	maxBytes?: number;
}

const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;
const SAFETY_RATIO = 0.8; // 컨테이너 오버헤드 여유
const MAX_ATTEMPTS = 3;

// 비디오 파일을 WebM으로 변환. maxBytes를 넘지 않도록 해상도/fps/비트레이트를 자동 조절
export const convertToWebm = async (
	file: File,
	options: IConvertOptions = {},
): Promise<File> => {
	const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
	const mimeType = getSupportedMimeType();
	if (!mimeType) {
		throw new Error("이 브라우저는 WebM 녹화를 지원하지 않습니다.");
	}

	const duration = await probeDuration(file);
	const safeDuration = Math.max(duration, 1);

	let bitsPerSecond = (maxBytes * SAFETY_RATIO * 8) / safeDuration;
	let tier = resolveTier(bitsPerSecond);
	let lastBlob: Blob | null = null;

	for (let attemptIdx = 0; attemptIdx < MAX_ATTEMPTS; attemptIdx++) {
		const blob = await encodeOnce(
			file,
			{ bitsPerSecond, tier },
			mimeType,
			safeDuration,
		);
		lastBlob = blob;

		if (blob.size <= maxBytes) break;

		if (attemptIdx === MAX_ATTEMPTS - 1) {
			const limitLabel = `${Math.floor(maxBytes / 1024)}KB`;
			throw new Error(
				`동영상이 너무 길어 ${limitLabel} 이하로 변환할 수 없습니다.`,
			);
		}

		// 실제 초과분에 비례해서 축소, 최소 15%는 줄임
		const scale = Math.min(0.85, (maxBytes / blob.size) * 0.85);
		bitsPerSecond = bitsPerSecond * scale;

		// 마지막 재시도에서는 계단도 한 단계 더 내림
		tier =
			attemptIdx === MAX_ATTEMPTS - 2
				? dropTier(tier)
				: resolveTier(bitsPerSecond);
	}

	if (!lastBlob) {
		throw new Error("동영상 변환에 실패했습니다.");
	}

	const fileName = file.name.replace(/\.[^/.]+$/, "") || "video";
	return new File([lastBlob], `${fileName}.webm`, { type: "video/webm" });
};
