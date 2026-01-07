import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/api/image";

export const useUploadImage = () => {
	return useMutation({
		mutationFn: uploadImage,
	});
};
