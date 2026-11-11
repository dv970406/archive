import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const PROJECT_ROOT = process.cwd();
export const CONTENT_DIR = path.join(PROJECT_ROOT, "content");
/** 공개 글 */
export const POSTS_DIR = path.join(CONTENT_DIR, "posts");
/** 초안 (git 에 포함되지 않음) */
export const DRAFTS_DIR = path.join(CONTENT_DIR, "drafts");
/** 공개 글의 이미지·영상 */
export const PUBLIC_POSTS_DIR = path.join(PROJECT_ROOT, "public", "posts");
export const CATEGORIES_FILE = path.join(CONTENT_DIR, "categories.json");

const SLUG_PATTERN = /^[a-z0-9-]+$/;

export const assertSlug = (slug: string | undefined): string => {
	if (!slug || !SLUG_PATTERN.test(slug)) {
		throw new Error(
			"slug 는 소문자 영문·숫자·하이픈(-)만 사용할 수 있습니다. 예) my-first-post",
		);
	}
	return slug;
};

export const getDraftPath = (slug: string) =>
	path.join(DRAFTS_DIR, `${slug}.mdx`);
export const getPostPath = (slug: string) =>
	path.join(POSTS_DIR, `${slug}.mdx`);

/** 공개 글 → 초안 순으로 찾는다 */
export const findPostFile = (slug: string): string | null =>
	[getPostPath(slug), getDraftPath(slug)].find((filePath) =>
		fs.existsSync(filePath),
	) ?? null;

export const readPostFile = (filePath: string) => {
	const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
	return { data, content };
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

/** 값을 받지 않는 플래그. 뒤따르는 positional 인자를 값으로 삼지 않도록 구분한다 */
const BOOLEAN_FLAGS = new Set(["summarize"]);

/** `<positional> --key value --flag` 형태의 인자를 파싱한다 */
export const parseArgs = (argv: string[]) => {
	const positional: string[] = [];
	const options: Record<string, string | true> = {};

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (!arg.startsWith("--")) {
			positional.push(arg);
			continue;
		}

		const key = arg.slice(2);
		const next = argv[i + 1];
		if (
			!BOOLEAN_FLAGS.has(key) &&
			next !== undefined &&
			!next.startsWith("--")
		) {
			options[key] = next;
			i++;
		} else {
			options[key] = true;
		}
	}

	return { positional, options };
};

export const toRelative = (filePath: string) =>
	path.relative(PROJECT_ROOT, filePath);
