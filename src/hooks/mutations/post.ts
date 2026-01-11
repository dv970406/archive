import { useMutation } from "@tanstack/react-query";
import { createPost, updatePost } from "@/api/post";

export const useCreatePostMutation = () => {
	return useMutation({
		mutationFn: createPost,
	});
};

export const useUpdatePostMutation = () => {
	return useMutation({
		mutationFn: updatePost,
	});
};
