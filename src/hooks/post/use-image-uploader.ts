import type { ClipboardEventHandler, DragEventHandler } from "react";
import { toast } from "sonner";
import { TEXTAREA_POST_EDITOR_ID } from "@/lib/constant/element-id";
import { isImage, isVideo } from "@/lib/utils/media-type";
import { convertToWebm } from "@/lib/utils/webm-converter";
import { convertToWebp } from "@/lib/utils/webp-converter";
import { useUploadImageMutation } from "../mutations/image";
import { useTextareaController } from "./use-textarea-controller";

const MAX_VIDEO_SIZE = 500 * 1024; // 500KB

interface IUseImageUploaderProps {
	postId: number;
}
export const useImageUploader = ({ postId }: IUseImageUploaderProps) => {
	const { insertTextAtCursor } = useTextareaController(TEXTAREA_POST_EDITOR_ID);
	const { mutate: uploadImage } = useUploadImageMutation();

	// 드래그 오버 핸들러
	const handleDragOver: DragEventHandler<HTMLTextAreaElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	// 업로드 공통 로직
	const handleUploadMedia = (mediaFile: File, mediaType: "image" | "video") => {
		const timestamp = Date.now();
		const randomString = crypto.randomUUID();
		const fileExt = mediaFile.name.split(".").pop() ?? "bin";
		const filePath = `${postId}/${timestamp}-${randomString}.${fileExt}`;

		uploadImage(
			{ file: mediaFile, filePath },
			{
				onSuccess: (receivedData) => {
					const markdown =
						mediaType === "video"
							? `<Video src="${receivedData}" width={100} />\n`
							: `<Image src="${receivedData}" width={100} />\n`;
					insertTextAtCursor(markdown);
				},
				onError: (error) => {
					toast.error(`업로드 실패: ${error.message}`, {
						position: "top-center",
					});
				},
			},
		);
	};

	// 파일 처리 공통 로직
	const processFile = async (file: File) => {
		try {
			if (isImage(file)) {
				const convertedFile = await convertToWebp(file);
				handleUploadMedia(convertedFile, "image");
			} else if (isVideo(file)) {
				const toastId = toast.loading("동영상 변환 중...", {
					position: "top-center",
				});
				const convertedFile = await convertToWebm(file);
				toast.dismiss(toastId);
				if (convertedFile.size > MAX_VIDEO_SIZE) {
					toast.error("동영상 파일은 500KB 이하만 업로드 가능합니다.", {
						position: "top-center",
					});
					return;
				}
				handleUploadMedia(convertedFile, "video");
			} else {
				toast.error("지원하지 않는 파일 형식입니다.", {
					position: "top-center",
				});
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "알 수 없는 오류";
			toast.error(`변환 실패: ${errorMessage}`, {
				position: "top-center",
			});
		}
	};

	// 드롭 핸들러
	const handleDrop: DragEventHandler<HTMLTextAreaElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const files = Array.from(event.dataTransfer.files);
		for (const file of files) {
			processFile(file);
		}
	};

	// 붙여넣기 핸들러
	const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = (event) => {
		const items = Array.from(event.clipboardData.items);
		const mediaItems = items.filter(
			(item) =>
				item.type.startsWith("image/") || item.type.startsWith("video/"),
		);

		// 미디어가 아니면 기본 붙여넣기 동작 수행
		if (mediaItems.length === 0) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		for (const mediaItem of mediaItems) {
			const file = mediaItem.getAsFile();
			if (!file) {
				toast.error("파일을 가져올 수 없습니다.", {
					position: "top-center",
				});
				continue;
			}
			processFile(file);
		}
	};

	return {
		handleDragOver,
		handleDrop,
		handlePaste,
	};
};
