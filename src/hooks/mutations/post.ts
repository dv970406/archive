import { useMutation } from "@tanstack/react-query";
import { createPost, increasePostViewCount, updatePost } from "@/api/post";

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

export const useIncreasePostViewCount = () => {
	return useMutation({
		mutationFn: increasePostViewCount,
	});
};
