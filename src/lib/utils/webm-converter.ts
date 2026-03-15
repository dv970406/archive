// 브라우저에서 지원하는 WebM mimeType 선택 (없으면 undefined → 브라우저 기본값 사용)
const getSupportedMimeType = (): string | undefined => {
	const candidates = [
		"video/webm;codecs=vp9",
		"video/webm;codecs=vp8",
		"video/webm",
	];
	return candidates.find((type) => MediaRecorder.isTypeSupported(type));
};

// 비디오 파일을 WebM으로 변환 (canvas + MediaRecorder, 오디오 미포함)
export const convertToWebm = (file: File): Promise<File> => {
	return new Promise((resolve, reject) => {
		const video = document.createElement("video");
		const objectUrl = URL.createObjectURL(file);
		let rafId = 0;
		let timeoutId = 0;

		const cleanup = () => {
			cancelAnimationFrame(rafId);
			clearTimeout(timeoutId);
			video.pause();
			video.src = "";
			URL.revokeObjectURL(objectUrl);
		};

		video.src = objectUrl;
		video.muted = true;
		video.playsInline = true;

		video.onerror = () => {
			cleanup();
			reject(new Error("비디오 파일을 로드할 수 없습니다."));
		};

		video.onloadedmetadata = () => {
			const canvas = document.createElement("canvas");
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			const ctx = canvas.getContext("2d");
			if (!ctx) {
				cleanup();
				reject(new Error("Canvas context를 생성할 수 없습니다."));
				return;
			}

			const mimeType = getSupportedMimeType();
			const stream = canvas.captureStream(30);
			// mimeType이 없으면 브라우저 기본값 사용 (MediaRecorder 생성자 throw 방지)
			const recorder = mimeType
				? new MediaRecorder(stream, { mimeType })
				: new MediaRecorder(stream);
			const chunks: Blob[] = [];

			recorder.ondataavailable = (e) => {
				if (e.data.size > 0) chunks.push(e.data);
			};

			recorder.onstop = () => {
				for (const track of stream.getTracks()) track.stop();
				cleanup();
				const blob = new Blob(chunks, { type: "video/webm" });
				const fileName = file.name.replace(/\.[^/.]+$/, "") || "video";
				resolve(new File([blob], `${fileName}.webm`, { type: "video/webm" }));
			};

			const drawFrame = () => {
				ctx.drawImage(video, 0, 0);
				if (!video.ended) {
					rafId = requestAnimationFrame(drawFrame);
				}
			};

			video.onended = () => {
				cancelAnimationFrame(rafId);
				ctx.drawImage(video, 0, 0); // 마지막 프레임 명시적 렌더링
				recorder.stop();
			};

			// duration이 비정상적이거나 onended가 누락되는 경우를 대비한 타임아웃
			if (Number.isFinite(video.duration)) {
				const timeoutMs = (video.duration + 2) * 1000;
				timeoutId = window.setTimeout(() => {
					if (recorder.state === "recording") recorder.stop();
				}, timeoutMs);
			}

			video
				.play()
				.then(() => {
					recorder.start();
					rafId = requestAnimationFrame(drawFrame);
				})
				.catch((err) => {
					cleanup();
					reject(err);
				});
		};
	});
};
