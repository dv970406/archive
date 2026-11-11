import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { parseMarkdownToPlainText } from "@/lib/utils/markdown";
import { formatTimeAgo } from "@/lib/utils/time";
import type {
	AdjacentPost,
	Post,
	PostCard,
	PostFrontmatter,
} from "@/types/post";
import { getCategoryByPathname } from "./categories";

const CONTENT_DIR = path.join(process.cwd(), "content");
/** 공개 글 */
const POSTS_DIR = path.join(CONTENT_DIR, "posts");
/** 초안. git 에 포함되지 않으며 개발 서버에서만 미리보기로 노출된다 */
export const DRAFTS_DIR = path.join(CONTENT_DIR, "drafts");

const isDevelopment = process.env.NODE_ENV === "development";

/** 피드 카드 발췌문 최대 길이. 카드는 두 줄만 보여주므로 본문 전체를 클라이언트로 보내지 않는다 */
const EXCERPT_MAX_LENGTH = 300;

const toIsoString = (value: unknown, field: string, file: string): string => {
	// YAML 에서 따옴표 없는 날짜는 Date 로 파싱되므로 두 형태를 모두 받는다
	const date =
		value instanceof Date
			? value
			: typeof value === "string"
				? new Date(value)
				: null;

	if (!date || Number.isNaN(date.getTime())) {
		throw new Error(
			`[content] ${file}: ${field} 는 ISO 8601 형식의 날짜여야 합니다.`,
		);
	}
	return date.toISOString();
};

const toOptionalString = (
	value: unknown,
	field: string,
	file: string,
): string | null => {
	if (value === undefined || value === null || value === "") return null;
	if (typeof value !== "string") {
		throw new Error(`[content] ${file}: ${field} 는 문자열이어야 합니다.`);
	}
	return value;
};

/** MDX 파일 하나를 읽어 Post 로 변환한다. 프론트매터가 잘못되면 파일명을 담아 throw 해 빌드를 실패시킨다 */
const parsePostFile = (dir: string, fileName: string): Post => {
	const filePath = path.join(dir, fileName);
	const file = path.relative(process.cwd(), filePath);
	const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
	const frontmatter = data as Partial<Record<keyof PostFrontmatter, unknown>>;

	if (
		typeof frontmatter.title !== "string" ||
		frontmatter.title.trim() === ""
	) {
		throw new Error(`[content] ${file}: title 이 비어 있습니다.`);
	}
	if (typeof frontmatter.category !== "string") {
		throw new Error(`[content] ${file}: category 가 없습니다.`);
	}
	const category = getCategoryByPathname(frontmatter.category);
	if (!category) {
		throw new Error(
			`[content] ${file}: 존재하지 않는 카테고리 "${frontmatter.category}" 입니다. content/categories.json 의 pathname 중 하나여야 합니다.`,
		);
	}

	return {
		slug: fileName.replace(/\.mdx$/, ""),
		title: frontmatter.title,
		category,
		thumbnail: toOptionalString(frontmatter.thumbnail, "thumbnail", file),
		summary: toOptionalString(frontmatter.summary, "summary", file),
		publishedAt: toIsoString(frontmatter.publishedAt, "publishedAt", file),
		updatedAt: toIsoString(frontmatter.updatedAt, "updatedAt", file),
		content,
	};
};

const readPostsInDir = (dir: string): Post[] => {
	if (!fs.existsSync(dir)) return [];

	return fs
		.readdirSync(dir)
		.filter((fileName) => fileName.endsWith(".mdx"))
		.map((fileName) => parsePostFile(dir, fileName));
};

/**
 * 공개 글 전체를 발행일 내림차순으로 반환한다.
 * React cache 로 감싸 한 번의 렌더(요청) 안에서는 파일을 한 번만 읽는다.
 */
export const getPublishedPosts = cache((): Post[] => {
	const posts = [
		...readPostsInDir(POSTS_DIR),
		...(isDevelopment ? readPostsInDir(DRAFTS_DIR) : []),
	];

	const slugs = new Set<string>();
	for (const post of posts) {
		if (slugs.has(post.slug)) {
			throw new Error(`[content] slug "${post.slug}" 가 중복됩니다.`);
		}
		slugs.add(post.slug);
	}

	return posts.sort(
		(a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
	);
});

export const getPostBySlug = (slug: string): Post | null =>
	getPublishedPosts().find((post) => post.slug === slug) ?? null;

export const getPostsByCategory = (pathname: string): Post[] =>
	getPublishedPosts().filter((post) => post.category.pathname === pathname);

/**
 * 같은 카테고리 안에서의 이전/다음 글
 * - 이전 글: 발행일이 현재 글보다 과거인 글 중 가장 최신
 * - 다음 글: 발행일이 현재 글보다 미래인 글 중 가장 오래된
 */
export const getAdjacentPosts = (
	post: Post,
): { prev: AdjacentPost | null; next: AdjacentPost | null } => {
	const publishedAt = Date.parse(post.publishedAt);
	// 발행일 내림차순으로 정렬된 같은 카테고리의 다른 글들
	const siblings = getPostsByCategory(post.category.pathname).filter(
		(sibling) => sibling.slug !== post.slug,
	);

	const toAdjacent = (target: Post | undefined): AdjacentPost | null =>
		target ? { slug: target.slug, title: target.title } : null;

	const olderPosts = siblings.filter(
		(sibling) => Date.parse(sibling.publishedAt) < publishedAt,
	);
	const newerPosts = siblings.filter(
		(sibling) => Date.parse(sibling.publishedAt) > publishedAt,
	);

	return {
		prev: toAdjacent(olderPosts[0]),
		next: toAdjacent(newerPosts[newerPosts.length - 1]),
	};
};

/** 피드 카드용 데이터로 변환한다 */
export const toPostCard = (post: Post): PostCard => ({
	slug: post.slug,
	title: post.title,
	categoryTitle: post.category.title,
	thumbnail: post.thumbnail,
	publishedAt: post.publishedAt,
	publishedAtLabel: formatTimeAgo(post.publishedAt),
	excerpt: parseMarkdownToPlainText(post.content).slice(0, EXCERPT_MAX_LENGTH),
});
