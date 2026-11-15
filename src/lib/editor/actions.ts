"use server";

import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { generateSummary } from "@/lib/ai/summary";
import {
	findPostLocation,
	getMediaDir,
	getMediaUrlPrefix,
	getPostFilePath,
	isValidSlug,
	type PostLocation,
	readCategoryPathnames,
	readPostFile,
	relocatePost,
	renamePost,
	resolveMediaFile,
	rewriteMediaSlug,
	writePostFile,
} from "@/lib/content/post-files";
import type { EditorDraft } from "./types";

/**
 * 개발 서버 전용 에디터의 Server Action.
 * 이 모듈은 `page.dev.tsx` 에서만 import 되므로 프로덕션 빌드 결과에는 포함되지 않는다.
 * 혹시라도 다른 곳에서 import 되어 배포되는 일을 막기 위해 모든 액션이 개발 환경인지 먼저 확인한다.
 */

type ActionResult<T = object> =
	| ({ ok: true; warning?: string } & T)
	| { ok: false; message: string };

const assertDevelopment = () => {
	if (process.env.NODE_ENV !== "development") {
		throw new Error("에디터는 개발 서버에서만 사용할 수 있습니다.");
	}
};

/** 예외를 결과 객체로 바꿔 클라이언트에서 메시지를 보여줄 수 있게 한다 */
const runAction = async <T>(
	task: () => Promise<ActionResult<T>> | ActionResult<T>,
): Promise<ActionResult<T>> => {
	try {
		assertDevelopment();
		return await task();
	} catch (error) {
		return {
			ok: false,
			message: error instanceof Error ? error.message : "알 수 없는 오류",
		};
	}
};

export interface ISavePostInput extends EditorDraft {
	location: PostLocation;
	/** 파일로 저장된 slug. 아직 한 번도 저장하지 않은 새 글이면 null */
	savedSlug: string | null;
}

const validateDraft = ({ slug, title, category }: EditorDraft) => {
	if (title.trim() === "") throw new Error("제목을 입력해주세요.");
	if (!isValidSlug(slug)) {
		throw new Error("경로는 소문자 영문·숫자·하이픈(-)만 사용할 수 있습니다.");
	}
	if (!readCategoryPathnames().includes(category)) {
		throw new Error("카테고리를 선택해주세요.");
	}
};

/** 썸네일이 바뀌었으면 이전 썸네일 파일(thumbnail-*)을 지운다. 본문 이미지를 썸네일로 쓴 경우는 건드리지 않는다 */
const removeReplacedThumbnail = (
	location: PostLocation,
	slug: string,
	prevThumbnail: unknown,
	nextThumbnail: string | null,
) => {
	if (typeof prevThumbnail !== "string" || prevThumbnail === nextThumbnail) {
		return;
	}
	const filePath = resolveMediaFile(location, slug, prevThumbnail);
	if (
		filePath &&
		path.basename(filePath).startsWith("thumbnail-") &&
		fs.existsSync(filePath)
	) {
		fs.rmSync(filePath);
	}
};

/** 에디터 내용을 파일에 쓴다. 새 글이면 초안을 만들고, slug 가 바뀌었으면 파일·미디어 폴더 이름도 바꾼다 */
const writeDraftToFile = (input: ISavePostInput) => {
	validateDraft(input);
	const { location, savedSlug, slug, title, category, content } = input;
	let { thumbnail } = input;
	let nextContent = content;
	const now = new Date().toISOString();

	if (savedSlug === null) {
		if (location !== "draft")
			throw new Error("새 글은 초안으로만 만들 수 있습니다.");
		if (findPostLocation(slug)) {
			throw new Error(`이미 존재하는 경로(slug)입니다: ${slug}`);
		}
		writePostFile(
			getPostFilePath("draft", slug),
			{ title, category, publishedAt: now, updatedAt: now },
			"",
		);
	} else if (savedSlug !== slug) {
		renamePost(location, savedSlug, slug);
		// 에디터가 보낸 본문·썸네일도 옛 slug 의 미디어 경로를 담고 있으므로 함께 바꾼다
		nextContent = rewriteMediaSlug(nextContent, savedSlug, slug);
		thumbnail = thumbnail && rewriteMediaSlug(thumbnail, savedSlug, slug);
	}

	const filePath = getPostFilePath(location, slug);
	const { data } = readPostFile(filePath);

	removeReplacedThumbnail(location, slug, data.thumbnail, thumbnail);

	const nextData: Record<string, unknown> = {
		...data,
		title,
		category,
		// 공개 글을 고쳤으면 수정 시각을 갱신한다 (sitemap lastModified, JSON-LD dateModified)
		updatedAt: now,
	};
	if (thumbnail) nextData.thumbnail = thumbnail;
	else delete nextData.thumbnail;

	writePostFile(filePath, nextData, nextContent);

	return {
		slug,
		content: nextContent,
		thumbnail,
		renamedFrom: savedSlug !== null && savedSlug !== slug ? savedSlug : null,
	};
};

type SaveResult = ActionResult<ReturnType<typeof writeDraftToFile>>;

/** AI 요약을 만든다. 키가 없거나 실패해도 발행·저장을 막지 않도록 경고 메시지로 돌려준다 */
const trySummarize = async (
	content: string,
): Promise<{ summary?: string; warning?: string }> => {
	try {
		return { summary: await generateSummary(content) };
	} catch (error) {
		const reason = error instanceof Error ? error.message : "알 수 없는 오류";
		return { warning: `AI 요약 생성에 실패했습니다: ${reason}` };
	}
};

/** 임시저장(초안) 또는 공개 글 저장 */
export const savePost = async (
	input: ISavePostInput & { summarize?: boolean },
): Promise<SaveResult> =>
	runAction(async () => {
		const saved = writeDraftToFile(input);
		if (!input.summarize) return { ok: true, ...saved };

		const { summary, warning } = await trySummarize(saved.content);
		if (summary) {
			const filePath = getPostFilePath(input.location, saved.slug);
			const { data, content } = readPostFile(filePath);
			writePostFile(filePath, { ...data, summary }, content);
		}
		return { ok: true, warning, ...saved };
	});

/** 초안을 저장한 뒤 공개 글로 옮긴다 (content/drafts → content/posts, 미디어는 public/posts 로) */
export const publishDraft = async (
	input: ISavePostInput & { summarize: boolean },
): Promise<SaveResult> =>
	runAction(async () => {
		if (input.location !== "draft")
			throw new Error("초안만 발행할 수 있습니다.");
		if (input.content.trim() === "") throw new Error("내용을 입력해주세요.");

		const saved = writeDraftToFile(input);

		const now = new Date().toISOString();
		const updateData: Record<string, unknown> = {
			publishedAt: now,
			updatedAt: now,
		};
		const { summary, warning } = input.summarize
			? await trySummarize(saved.content)
			: {};
		if (summary) updateData.summary = summary;

		relocatePost(saved.slug, "draft", "post", updateData);
		return { ok: true, warning, ...saved };
	});

/** 공개 글을 저장한 뒤 초안으로 되돌린다 (숨기기). 커밋하면 사이트에서 내려간다 */
export const unpublishPost = async (
	input: ISavePostInput,
): Promise<SaveResult> =>
	runAction(() => {
		if (input.location !== "post")
			throw new Error("공개 글만 숨길 수 있습니다.");

		const saved = writeDraftToFile(input);
		relocatePost(saved.slug, "post", "draft");
		return { ok: true, ...saved };
	});

/**
 * 이미지·영상을 글의 미디어 폴더에 저장하고 본문에서 쓸 URL(/posts/<slug>/<파일>)을 돌려준다.
 * 변환(webp·webm)은 브라우저에서 끝내고 올린다
 */
export const uploadMedia = async (
	formData: FormData,
): Promise<ActionResult<{ src: string }>> =>
	runAction(async () => {
		const slug = formData.get("slug");
		const location = formData.get("location");
		const kind = formData.get("kind");
		const file = formData.get("file");

		if (typeof slug !== "string" || !isValidSlug(slug)) {
			throw new Error("잘못된 경로(slug)입니다.");
		}
		if (location !== "draft" && location !== "post") {
			throw new Error("잘못된 글 위치입니다.");
		}
		if (!(file instanceof File)) throw new Error("파일이 없습니다.");
		if (!fs.existsSync(getPostFilePath(location, slug))) {
			throw new Error("글을 먼저 저장한 뒤 업로드해주세요.");
		}

		const ext = path.extname(file.name).toLowerCase() || ".bin";
		// 같은 경로로 덮어쓰면 브라우저·next/image 캐시에 옛 파일이 보일 수 있어 항상 고유한 이름을 쓴다
		const fileName =
			kind === "thumbnail"
				? `thumbnail-${Date.now()}${ext}`
				: `${Date.now()}-${randomUUID()}${ext}`;

		const mediaDir = getMediaDir(location, slug);
		fs.mkdirSync(mediaDir, { recursive: true });
		fs.writeFileSync(
			path.join(mediaDir, fileName),
			new Uint8Array(await file.arrayBuffer()),
		);

		return { ok: true, src: `${getMediaUrlPrefix(slug)}${fileName}` };
	});
