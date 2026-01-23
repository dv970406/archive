import { type ChangeEventHandler, useRef } from "react";
import { convertToWebp } from "@/lib/utils/webp-converter";
import { useOpenAlertModal } from "@/store/alert-modal";
import { usePostDraft, useSetThumbnail } from "@/store/post/use-post-draft";
import type { Post } from "@/types/post";
import {
	useDeleteImageMutation,
	useUploadImageMutation,
} from "../mutations/image";

export interface IUseThumbnailHandler {
	postId: Post["id"];
}
export const useThumbnailHandler = ({ postId }: IUseThumbnailHandler) => {
	const setThumbnail = useSetThumbnail();
	const { thumbnail } = usePostDraft();

	const { mutate: uploadImage, isPending: isUploadImagePending } =
		useUploadImageMutation();

	const { mutate: deleteImage, isPending: isDeleteImagePending } =
		useDeleteImageMutation();

	const inputRef = useRef<HTMLInputElement>(null);

	const handleSelectThumbnail = () => {
		inputRef.current?.click();
	};

	const handleUploadThumbnail: ChangeEventHandler<HTMLInputElement> = async (
		event,
	) => {
		const thumbnailFile = event.target.files?.[0];
		if (!thumbnailFile) return;

		const fileExt = thumbnailFile.name.split(".").pop();

		// 썸네일은 고유하게 처리
		// 만약 업데이트할 경우 경로가 똑같다면 이전 파일이 캐시되어 보일 수 있음
		// 게다가 supbase CDN invalidation을 본인이 직접 할 수 없어서 고유한 파일명으로 캐시 문제 우회한다.
		const filePath = `${postId}/thumbnail-${Date.now()}.${fileExt}`;

		const thumbnailWebpFile = await convertToWebp(thumbnailFile);
		uploadImage(
			{
				file: thumbnailWebpFile,
				filePath,
			},
			{
				onSuccess: (receivedThumbnailUrl) => {
					setThumbnail(receivedThumbnailUrl);
				},
				onSettled: () => {
					// 동일한 파일을 올리려고 할 때 입력값이 바뀌지 않다고 인식하여 이벤트핸들러가 동작하지 않는 현상을 제거하기 위함
					event.target.value = "";
				},
			},
		);
	};

	const openAlertModal = useOpenAlertModal();
	const handleDeleteThumbnail = () => {
		if (!thumbnail) return;
		if (isDeleteImagePending) return;

		// https://supabase.co/storage/v1/object/~~/source.webp 에서
		// 엔드포인트인 source.webp를 찾아내서 삭제할 path로 전달
		const thumbnailEndPoint = thumbnail.split("/").pop();
		if (!thumbnailEndPoint) return;

		openAlertModal({
			title: "정말 썸네일을 삭제하시겠습니까?",
			description: "",
			onPositive: () => {
				deleteImage(`${postId}/${thumbnailEndPoint}`, {
					onSuccess: () => {
						setThumbnail(null);
					},
				});
			},
		});
	};

	return {
		inputRef,
		handleUploadThumbnail,
		handleDeleteThumbnail,
		handleSelectThumbnail,
		isUploadImagePending,
		thumbnail,
	};
};
