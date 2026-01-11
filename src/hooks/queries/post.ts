import { useQuery } from "@tanstack/react-query";
import { fetchPost, fetchSavedPostDraft } from "@/api/post";
import { QUERY_KEYS } from "@/lib/query-keys";

export const getPostByIdQuery = (postId: number) => ({
	queryKey: QUERY_KEYS.post.byId(postId),
	queryFn: () => fetchPost(postId),
});

export const useGetPostById = (postId: number) => {
	return useQuery(getPostByIdQuery(postId));
};

export const useGetSavedPostDraft = () => {
	return useQuery({
		queryKey: QUERY_KEYS.post.draft,
		queryFn: fetchSavedPostDraft,
	});
};
