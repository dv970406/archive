import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchPostById,
  fetchPostBySlug,
  fetchPosts,
  fetchSavedPostDraft,
} from "@/api/post";
import { QUERY_KEYS } from "@/lib/query-keys";

export const getPostByIdQuery = (postId: number) => ({
  queryKey: QUERY_KEYS.post.byId(postId),
  queryFn: () => fetchPostById(postId),
});

export const useGetPostById = (postId: number) => {
  return useQuery(getPostByIdQuery(postId));
};

export const getPostBySlugQuery = (slug: string) => ({
  queryKey: QUERY_KEYS.post.bySlug(slug),
  queryFn: () => fetchPostBySlug(slug),
});

export const useGetPostBySlug = (slug: string) => {
  return useQuery(getPostBySlugQuery(slug));
};

export const useGetSavedPostDraft = () => {
  return useQuery({
    queryKey: QUERY_KEYS.post.draft,
    queryFn: fetchSavedPostDraft,
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
  });
};
