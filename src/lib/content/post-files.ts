import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
	CATEGORIES_FILE,
	DRAFTS_DIR,
	POSTS_DIR,
	PROJECT_ROOT,
	PUBLIC_POSTS_DIR,
} from "./paths";

/**
 * 글 파일 쓰기·이동 유틸.
 * CLI 스크립트(scripts/)와 개발 서버 전용 에디터(/post/create, /post/<slug>/update)가 함께 쓴다.
 * 프로덕션 런타임에서는 import 되지 않는다 (배포 결과는 정적 사이트라 파일을 쓸 곳이 없다).
 */

/** 글이 놓인 위치. 초안은 content/drafts, 공개 글은 content/posts */
export type PostLocation = "draft" | "post";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

export const isValidSlug = (slug: string) => SLUG_PATTERN.test(slug);

export const assertSlug = (slug: string | undefined): string => {
	if (!slug || !isValidSlug(slug)) {
		throw new Error(
			"slug 는 소문자 영문·숫자·하이픈(-)만 사용할 수 있습니다. 예) my-first-post",
		);
	}
	return slug;
};

export const toRelative = (filePath: string) =>
	path.relative(PROJECT_ROOT, filePath);

export const getPostFilePath = (location: PostLocation, slug: string) =>
	path.join(location === "draft" ? DRAFTS_DIR : POSTS_DIR, `${slug}.mdx`);
export const getDraftPath = (slug: string) => getPostFilePath("draft", slug);
export const getPostPath = (slug: string) => getPostFilePath("post", slug);

/** 글의 이미지·영상 폴더. 초안은 content/drafts/<slug>/, 공개 글은 public/posts/<slug>/ */
export const getMediaDir = (location: PostLocation, slug: string) =>
	path.join(location === "draft" ? DRAFTS_DIR : PUBLIC_POSTS_DIR, slug);

/** 본문·프론트매터에서 미디어를 참조하는 URL 경로 접두사 (초안·공개 글 공통) */
export const getMediaUrlPrefix = (slug: string) => `/posts/${slug}/`;

/** 공개 글 → 초안 순으로 찾아 위치를 반환한다 */
export const findPostLocation = (slug: string): PostLocation | null => {
	if (fs.existsSync(getPostPath(slug))) return "post";
	if (fs.existsSync(getDraftPath(slug))) return "draft";
	return null;
};

/** 공개 글 → 초안 순으로 찾아 파일 경로를 반환한다 */
export const findPostFile = (slug: string): string | null => {
	const location = findPostLocation(slug);
	return location ? getPostFilePath(location, slug) : null;
};

export const readPostFile = (filePath: string) => {
	const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
	return { data: data as Record<string, unknown>, content };
};

export const writePostFile = (
	filePath: string,
	data: Record<string, unknown>,
	content: string,
) => {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	// 문자열을 넘기면 gray-matter 가 본문을 프론트매터 파일로 다시 파싱해 `---` 로 시작하는 본문이 깨진다. 객체 형태로 넘겨 재파싱을 막는다
	fs.writeFileSync(filePath, matter.stringify({ content }, data));
};

export const readCategoryPathnames = (): string[] => {
	const raw = JSON.parse(fs.readFileSync(CATEGORIES_FILE, "utf8")) as {
		pathname: string;
	}[];
	return raw.map((category) => category.pathname);
};

/** 초안 목록 (에디터의 "초안 불러오기"용) */
export const listDrafts = (): { slug: string; title: string }[] => {
	if (!fs.existsSync(DRAFTS_DIR)) return [];

	return fs
		.readdirSync(DRAFTS_DIR)
		.filter((fileName) => fileName.endsWith(".mdx"))
		.map((fileName) => {
			const slug = fileName.replace(/\.mdx$/, "");
			const { data } = readPostFile(path.join(DRAFTS_DIR, fileName));
			return {
				slug,
				title: typeof data.title === "string" ? data.title : slug,
			};
		});
};

/**
 * 미디어 폴더를 옮긴다. 대상 폴더가 이미 있으면 파일 단위로 합친다.
 * 이름이 겹치는 파일이 하나라도 있으면 아무것도 옮기지 않고 throw 한다
 */
const moveMediaDir = (from: string, to: string) => {
	if (!fs.existsSync(from)) return;

	if (!fs.existsSync(to)) {
		fs.mkdirSync(path.dirname(to), { recursive: true });
		fs.renameSync(from, to);
		return;
	}

	const fileNames = fs.readdirSync(from);
	const conflict = fileNames.find((name) => fs.existsSync(path.join(to, name)));
	if (conflict) {
		throw new Error(
			`같은 이름의 미디어 파일이 이미 있습니다: ${toRelative(path.join(to, conflict))}`,
		);
	}

	for (const name of fileNames) {
		fs.renameSync(path.join(from, name), path.join(to, name));
	}
	fs.rmSync(from, { recursive: true });
};

/**
 * 글을 초안 ↔ 공개 위치로 옮긴다. 미디어 폴더도 함께 옮기고 프론트매터는 updateData 로 덮어쓴다.
 * 미디어 URL(/posts/<slug>/...)은 두 위치에서 같으므로 본문은 그대로 둔다
 */
export const relocatePost = (
	slug: string,
	from: PostLocation,
	to: PostLocation,
	updateData: Record<string, unknown> = {},
) => {
	const fromPath = getPostFilePath(from, slug);
	const toPath = getPostFilePath(to, slug);

	if (!fs.existsSync(fromPath)) {
		throw new Error(`글이 없습니다: ${toRelative(fromPath)}`);
	}
	if (fs.existsSync(toPath)) {
		throw new Error(`이미 같은 slug 의 글이 있습니다: ${toRelative(toPath)}`);
	}

	const { data, content } = readPostFile(fromPath);

	moveMediaDir(getMediaDir(from, slug), getMediaDir(to, slug));
	writePostFile(toPath, { ...data, ...updateData }, content);
	fs.rmSync(fromPath);
};

/** 텍스트 안의 미디어 경로를 새 slug 기준으로 바꾼다 */
export const rewriteMediaSlug = (
	text: string,
	oldSlug: string,
	newSlug: string,
) => text.replaceAll(getMediaUrlPrefix(oldSlug), getMediaUrlPrefix(newSlug));

/**
 * 글의 slug 를 바꾼다. 파일·미디어 폴더 이름을 바꾸고 본문·썸네일의 미디어 경로도 새 slug 로 고친다
 */
export const renamePost = (
	location: PostLocation,
	oldSlug: string,
	newSlug: string,
) => {
	assertSlug(newSlug);

	if (findPostLocation(newSlug)) {
		throw new Error(`이미 존재하는 slug 입니다: ${newSlug}`);
	}
	const oldMediaDir = getMediaDir(location, oldSlug);
	const newMediaDir = getMediaDir(location, newSlug);
	if (fs.existsSync(newMediaDir)) {
		throw new Error(
			`새 slug 의 미디어 폴더가 이미 있습니다: ${toRelative(newMediaDir)}`,
		);
	}

	const oldPath = getPostFilePath(location, oldSlug);
	const { data, content } = readPostFile(oldPath);

	if (fs.existsSync(oldMediaDir)) {
		fs.renameSync(oldMediaDir, newMediaDir);
	}

	const nextData =
		typeof data.thumbnail === "string"
			? {
					...data,
					thumbnail: rewriteMediaSlug(data.thumbnail, oldSlug, newSlug),
				}
			: data;
	writePostFile(
		getPostFilePath(location, newSlug),
		nextData,
		rewriteMediaSlug(content, oldSlug, newSlug),
	);
	fs.rmSync(oldPath);
};

/**
 * 미디어 URL(/posts/<slug>/<파일>)을 실제 파일 경로로 바꾼다.
 * 글의 미디어 폴더 밖을 가리키면 null
 */
export const resolveMediaFile = (
	location: PostLocation,
	slug: string,
	src: string,
): string | null => {
	const prefix = getMediaUrlPrefix(slug);
	if (!src.startsWith(prefix)) return null;

	const mediaDir = getMediaDir(location, slug);
	const filePath = path.resolve(mediaDir, src.slice(prefix.length));
	return filePath.startsWith(mediaDir + path.sep) ? filePath : null;
};
