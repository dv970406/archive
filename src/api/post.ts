import { unstable_cache } from "next/cache";
import { SUPABASE_ERROR_CODE } from "@/lib/constant/error-code";
import supabaseClient from "@/lib/supabase/client";
import type { Post, PostEntity } from "@/types/post";

export const fetchAllPostsForUtils = unstable_cache(
	async () => {
		const { error, data } = await supabaseClient
			.from("post")
			.select("slug, updated_at")
			.order("updated_at", {
				ascending: true,
			})
			.eq("status", "PUBLISHED");

		if (error) throw error;
		return data;
	},
	["all-posts-for-utils"],
	{
		revalidate: 300,
	},
);

// post 데이터는 publish된 후 바뀔 일이 드물어 전반적으로 data cache의 revalidate를 300초로 유지
export const fetchPosts = unstable_cache(
	async ({
		from,
		to,
		categoryId,
	}: {
		from: number;
		to: number;
		categoryId?: number;
	}) => {
		const request = supabaseClient
			.from("post")
			.select("*, category: category!category_id (*)")
			.eq("status", "PUBLISHED")
			.order("published_at", {
				ascending: false,
				nullsFirst: false,
			})
			.range(from, to);

		if (categoryId) {
			request.eq("category_id", categoryId);
		}

		const { data, error } = await request;

		if (error) throw error;
		return data;
	},
	["posts"],
	{
		revalidate: 300,
	},
);

// 어드민(수정 화면) 전용 페치문
//
// status 필터를 일부러 걸지 않는다. 숨긴 글도 수정 화면에서는 불러올 수 있어야 하기 때문.
// 브라우저에서 로그인한 어드민만 호출하며, DRAFT/HIDDEN 차단은 RLS SELECT 정책이 담당한다.
export const fetchPostBySlug = async (slug: string) => {
	return supabaseClient
		.from("post")
		.select("*, category: category!category_id (*)")
		.eq("slug", slug)
		.single();
};

// 공개 상세 페이지(서버 컴포넌트) 전용
//
// RLS만 믿지 않고 status 필터를 명시적으로 건다. 서버는 항상 anon이므로 RLS로도
// 걸러지지만, 정책 변경/실수에 대비한 이중 방어이자 정책 적용 전에도 동작하게 하기 위함.
//
// notFound()를 이 콜백 안에서 던지면 안 된다. unstable_cache는 stale 엔트리를
// 재검증할 때 콜백이 throw하면 에러를 삼키고 캐시된 옛 값을 그대로 반환하며
// (next/dist/server/web/spec-extension/unstable-cache.js 의 catch 블록),
// 캐시 타임스탬프도 갱신하지 않아 숨긴 글이 영구히 계속 노출된다.
// 대신 null을 반환해 정상적으로 캐시에 기록되게 하고, 404 처리는 호출부에서 한다.
export const cachedPublishedPostBySlug = unstable_cache(
	async (slug: string) => {
		const { data, error } = await supabaseClient
			.from("post")
			.select("*, category: category!category_id (*)")
			.eq("slug", slug)
			.eq("status", "PUBLISHED")
			.single();

		if (error) {
			if (error?.code === SUPABASE_ERROR_CODE.NOT_FOUND) {
				return null;
			}
			throw error;
		}
		return data;
	},
	["published-post-by-slug"],
	{
		revalidate: 300,
	},
);

export const fetchSavedPostDraft = async () => {
	const { data, error } = await supabaseClient
		.from("post")
		.select("*, category: category!category_id (*)")
		.eq("status", "DRAFT")
		.single();

	if (error) throw error;
	return data;
};

// 어드민 전용 숨긴 글 목록
// RLS상 anon에게는 항상 빈 배열이 반환되므로 unstable_cache로 감싸면 안 된다.
export const fetchHiddenPosts = async () => {
	const { data, error } = await supabaseClient
		.from("post")
		.select("*, category: category!category_id (*)")
		.eq("status", "HIDDEN")
		// DESC의 PG 기본값은 NULLS FIRST라, published_at이 없는 행이 위로 올라오는 것을 막는다
		.order("published_at", {
			ascending: false,
			nullsFirst: false,
		});

	if (error) throw error;
	return data;
};

type ICreatePostProps = Pick<
	PostEntity,
	"content" | "title" | "category_id" | "thumbnail" | "slug" | "ai_summary"
>;
export const createPost = async ({
	category_id,
	content,
	title,
	thumbnail,
	slug,
	ai_summary,
}: ICreatePostProps) => {
	const { data, error } = await supabaseClient
		.from("post")
		.insert({
			content,
			category_id,
			title,
			thumbnail,
			status: "DRAFT",
			slug,
			ai_summary,
		})
		.select()
		.single();

	if (error) throw error;

	return data;
};

// status는 DB의 post_status enum에서 파생되어 PostStatus로 좁혀져 있다
interface IUpdatePostProps
	extends Partial<
		Pick<
			Post,
			| "content"
			| "title"
			| "category_id"
			| "thumbnail"
			| "status"
			| "view_count"
			| "published_at"
			| "updated_at"
			| "slug"
			| "ai_summary"
		>
	> {
	id: PostEntity["id"];
}
export const updatePost = async ({ id, ...rest }: IUpdatePostProps) => {
	const { data, error } = await supabaseClient
		.from("post")
		.update(rest)
		.eq("id", id)
		.select()
		.single();

	if (error) throw error;

	return data;
};

export const increasePostViewCount = async (postId: number) => {
	const { error } = await supabaseClient.rpc("increase_post_view_count", {
		post_id: postId,
	});

	if (error) throw error;
};

type IFetchAdjacentPostsProps = Pick<
	PostEntity,
	"category_id" | "published_at" | "id"
>;

export const fetchAdjacentPosts = unstable_cache(
	async ({ category_id, id, published_at }: IFetchAdjacentPostsProps) => {
		if (!category_id) {
			return {
				prev: null,
				next: null,
			};
		}

		// 이전 글: 같은 카테고리에서 publishedAt이 현재보다 과거인 글 중 가장 최신인 글
		const prevPromise = supabaseClient
			.from("post")
			.select("slug, title")
			.eq("category_id", category_id)
			.eq("status", "PUBLISHED")
			.neq("id", id)
			.lt("published_at", published_at)
			.order("published_at", { ascending: false })
			.limit(1)
			.single();

		// 다음 글: 같은 카테고리에서 publishedAt이 현재보다 미래인 글 중 가장 오래된 글
		const nextPromise = supabaseClient
			.from("post")
			.select("slug, title")
			.eq("category_id", category_id)
			.eq("status", "PUBLISHED")
			.neq("id", id)
			.gt("published_at", published_at)
			.order("published_at", { ascending: true })
			.limit(1)
			.single();

		const [prevResult, nextResult] = await Promise.all([
			prevPromise,
			nextPromise,
		]);

		return {
			prev: prevResult.data,
			next: nextResult.data,
		};
	},
	["adjacent-posts"],
	{
		revalidate: 300,
	},
);

export const fetchAllPosts = unstable_cache(
	async () => {
		const { data, error } = await supabaseClient
			.from("post")
			.select("*, category: category!category_id (*)")
			.eq("status", "PUBLISHED")
			.order("published_at", {
				ascending: false,
				nullsFirst: false,
			});

		if (error) throw error;
		return data;
	},
	["all-posts"],
	{
		revalidate: 300,
	},
);
