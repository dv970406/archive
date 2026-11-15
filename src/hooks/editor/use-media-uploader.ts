import {
	type ClipboardEventHandler,
	type DragEventHandler,
	useState,
} from "react";
import { isImage, isVideo } from "@/lib/utils/media-type";
import { convertToWebm } from "@/lib/utils/webm-converter";
import { convertToWebp } from "@/lib/utils/webp-converter";
import type { IUsePostEditorReturn } from "./use-post-editor";

type IUseMediaUploaderProps = Pick<
	IUsePostEditorReturn,
	"upload" | "insertAtCursor"
>;

/** 본문 textarea 에 이미지·영상을 드래그하거나 붙여넣으면 변환 후 글의 미디어 폴더에 저장하고 태그를 넣는다 */
export const useMediaUploader = ({
	upload,
	insertAtCursor,
}: IUseMediaUploaderProps) => {
	/** 변환·업로드 중인 파일 수 */
	const [uploadingCount, setUploadingCount] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const processFile = async (file: File) => {
		if (!isImage(file) && !isVideo(file)) {
			setError(`지원하지 않는 파일 형식입니다: ${file.name}`);
			return;
		}

		setError(null);
		setUploadingCount((count) => count + 1);
		try {
			// GIF 는 webp 로 바꾸면 첫 프레임만 남으므로 그대로 올린다
			const converted = isVideo(file)
				? await convertToWebm(file)
				: file.type === "image/gif"
					? file
					: await convertToWebp(file);

			const src = await upload(converted, "body");
			if (!src) return;

			insertAtCursor(
				isVideo(file)
					? `<Video src="${src}" width={100} />\n`
					: `<Image src="${src}" width={100} />\n`,
			);
		} catch (caught) {
			const message =
				caught instanceof Error ? caught.message : "알 수 없는 오류";
			setError(`변환 실패: ${message}`);
		} finally {
			setUploadingCount((count) => count - 1);
		}
	};

	const handleDragOver: DragEventHandler<HTMLTextAreaElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDrop: DragEventHandler<HTMLTextAreaElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();
		for (const file of Array.from(event.dataTransfer.files)) {
			processFile(file);
		}
	};

	const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = (event) => {
		const mediaFiles = Array.from(event.clipboardData.items)
			.filter(
				(item) =>
					item.type.startsWith("image/") || item.type.startsWith("video/"),
			)
			.map((item) => item.getAsFile())
			.filter((file): file is File => file !== null);

		// 미디어가 아니면 기본 붙여넣기 동작
		if (mediaFiles.length === 0) return;

		event.preventDefault();
		event.stopPropagation();
		for (const file of mediaFiles) {
			processFile(file);
		}
	};

	return {
		isUploading: uploadingCount > 0,
		uploadError: error,
		handleDragOver,
		handleDrop,
		handlePaste,
	};
};
