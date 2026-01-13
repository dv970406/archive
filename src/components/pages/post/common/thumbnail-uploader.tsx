import { XIcon } from "lucide-react";
import Link from "next/link";
import { type ChangeEventHandler, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	useDeleteImageMutation,
	useUploadImageMutation,
} from "@/hooks/mutations/image";
import { useOpenAlertModal } from "@/store/alert-modal";
import type { Post } from "@/types/post";

interface IThumbnailUploader {
	selectedThumbnail: Post["thumbnail"];
	onChange: (thumbnail: Post["thumbnail"]) => void;
	postId: Post["id"];
}
const ThumbnailUploader = ({
	onChange,
	selectedThumbnail,
	postId,
}: IThumbnailUploader) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { mutate: uploadImage, isPending: isUploadImagePending } =
		useUploadImageMutation();

	const { mutate: deleteImage, isPending: isDeleteImagePending } =
		useDeleteImageMutation();

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

		uploadImage(
			{
				file: thumbnailFile,
				filePath,
			},
			{
				onSuccess: (receivedThumbnailUrl) => {
					onChange(receivedThumbnailUrl);
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
		if (!selectedThumbnail) return;
		if (isDeleteImagePending) return;

		// https://supabase.co/storage/v1/object/~~/source.webp 에서
		// 엔드포인트인 source.webp를 찾아내서 삭제할 path로 전달
		const thumbnailEndPoint = selectedThumbnail.split("/").pop();
		if (!thumbnailEndPoint) return;

		openAlertModal({
			title: "정말 썸네일을 삭제하시겠습니까?",
			description: "",
			onPositive: () => {
				deleteImage(`${postId}/${thumbnailEndPoint}`, {
					onSuccess: () => {
						onChange(null);
					},
				});
			},
		});
	};

	if (selectedThumbnail) {
		return (
			<div className="flex gap-1.5 items-center">
				<Link href={selectedThumbnail} target="_blank" className="text-primary">
					미리보기
				</Link>

				<button type="button" onClick={handleDeleteThumbnail}>
					<XIcon className="w-4 h-4 text-white" />
				</button>
			</div>
		);
	}

	return (
		<>
			<input
				type="file"
				className="hidden"
				ref={inputRef}
				accept="image/webp"
				onChange={handleUploadThumbnail}
				disabled={isUploadImagePending}
			/>
			<Button onClick={handleSelectThumbnail} disabled={isUploadImagePending}>
				썸네일 업로드
			</Button>
		</>
	);
};

export default ThumbnailUploader;
