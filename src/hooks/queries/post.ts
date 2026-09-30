import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
	fetchAllPosts,
	fetchHiddenPosts,
	fetchPostBySlug,
	fetchPosts,
	fetchSavedPostDraft,
} from "@/api/post";
import { QUERY_KEYS } from "@/lib/query-keys";

export const getPostBySlugQuery = (slug: string) => ({
	queryKey: QUERY_KEYS.post.bySlug(slug),
	queryFn: async () => {
		const { data, error } = await fetchPostBySlug(slug);

		if (error) {
			throw error;
		}

		return data;
	},
});

export const useGetPostBySlug = (slug: string) => {
	return useQuery(getPostBySlugQuery(slug));
};

export const useGetSavedPostDraft = () => {
	return useQuery({
		queryKey: QUERY_KEYS.post.draft,
		queryFn: fetchSavedPostDraft,
		// 작성 화면을 떠나면 캐시를 바로 버려, 재진입할 때마다 DB의 현재 DRAFT를 다시 조회한다.
		// 전역 기본값(gcTime 10분 + refetchOnMount:false)에서는 옛 스냅샷이 그대로 쓰여
		// 이미 발행한 글을 임시저장 글로 착각해 비우거나, 자동저장된 최신 내용을 옛 내용으로 덮어쓴다.
		gcTime: 0,
	});
};

// 어드민 전용. 비로그인 상태에서 불필요한 요청을 막기 위해 enabled로 제어한다.
export const useGetHiddenPosts = ({ enabled }: { enabled: boolean }) => {
	return useQuery({
		queryKey: QUERY_KEYS.post.hidden,
		queryFn: fetchHiddenPosts,
		enabled,
	});
};

const PAGE_SIZE = 10;

export const getInfinitePostsQuery = (categoryId?: number) => ({
	queryKey: QUERY_KEYS.post.list(categoryId),
	queryFn: async ({ pageParam }: { pageParam: number }) => {
		const from = pageParam * PAGE_SIZE;
		const to = from + PAGE_SIZE - 1;

		const posts = await fetchPosts({
			from,
			to,
			categoryId,
		});

		return posts;
	},
	initialPageParam: 0,
});

export const useGetInfinitePosts = (categoryId?: number) => {
	return useInfiniteQuery({
		...getInfinitePostsQuery(categoryId),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length < PAGE_SIZE) return undefined;
			return allPages.length;
		},
		// 유저가 리스트를 보다가 다른 페이지로 갔다가 다시 리스트로 돌아왔을 때 또 방대한 리스트 데이터를 페칭하는 것을 막기 위함
		staleTime: Infinity,
		gcTime: Infinity,
	});
};

export const getAllPostsQuery = {
	queryKey: QUERY_KEYS.post.all,
	queryFn: fetchAllPosts,
};

export const useGetAllPosts = () => {
	return useQuery(getAllPostsQuery);
};
