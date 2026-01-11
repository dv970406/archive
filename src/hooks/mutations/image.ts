import { useMutation } from "@tanstack/react-query";
import { deleteImage, deleteImagesInPath, uploadImage } from "@/api/image";

export const useUploadImageMutation = () => {
	return useMutation({
		mutationFn: uploadImage,
	});
};

export const useDeleteImageMutation = () => {
	return useMutation({
		mutationFn: deleteImage,
	});
};

export const useDeleteImagesInPathMutation = () => {
	return useMutation({
		mutationFn: deleteImagesInPath,
	});
};
