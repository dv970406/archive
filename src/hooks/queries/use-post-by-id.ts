import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "@/api/post";
import { QUERY_KEYS } from "@/lib/query-keys";

export const postByIdQuery = (postId: number) => ({
	queryKey: QUERY_KEYS.post.byId(postId),
	queryFn: () => fetchPost(postId),
});

export const usePostById = (postId: number) => {
	return useQuery(postByIdQuery(postId));
};
