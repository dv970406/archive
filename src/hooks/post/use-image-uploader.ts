import {
	type ClipboardEventHandler,
	type DragEventHandler,
	useRef,
} from "react";
import { toast } from "sonner";
import { convertToWebp } from "@/lib/utils/webp-converter";
import { useUploadImageMutation } from "../mutations/image";

interface IUseImageUploaderProps {
	postId: number;
	content: string;
	setContent: (content: string) => void;
}
export const useImageUploader = ({
	postId,
	content,
	setContent,
}: IUseImageUploaderProps) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { mutate: uploadImage } = useUploadImageMutation();

	// 현재 커서 위치에 텍스트 삽입
	const insertTextAtCursor = (text: string) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const { selectionStart, selectionEnd } = textarea;

		// 커서 위치 전/후로 content string을 분할한다.
		const before = content.slice(0, selectionStart);
		const after = content.slice(selectionEnd);

		// 개행을 해야하는지 체크
		const needsNewline = before.length > 0 && !before.endsWith("\n");
		const inserted = (needsNewline ? "\n" : "") + text;

		// 커서 위치에 새로운 content를 넣는다.
		const newContent = before + inserted + after;
		setContent(newContent);

		// 커서 위치를 삽입된 텍스트 뒤로 이동
		const newCursorPos = selectionStart + inserted.length;
		setTimeout(() => {
			textarea.selectionStart = textarea.selectionEnd = newCursorPos;
			textarea.focus();
		}, 0);
	};

	// 드래그 오버 핸들러
	const handleDragOver: DragEventHandler<HTMLTextAreaElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	// 이미지 업로드 공통 로직
	const handleUploadImage = async (imageFile: File) => {
		try {
			const timestamp = Date.now();
			const randomString = crypto.randomUUID();

			const fileExt = imageFile.name.split(".").pop();

			// webp로 변환되므로 확장자는 항상 webp
			const filePath = `${postId}/${timestamp}-${randomString}.${fileExt}`;

			uploadImage(
				{ file: imageFile, filePath },
				{
					onSuccess: (receivedData) => {
						// textarea 최하단에 이미지를 마크다운 문법으로 추가
						const imageMarkdown = `![](${receivedData})\n`;
						insertTextAtCursor(imageMarkdown);
					},
					onError: (error) => {
						toast.error(`업로드 실패: ${error.message}`, {
							position: "top-center",
						});
					},
				},
			);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "알 수 없는 오류";
			toast.error(`이미지 변환 실패: ${errorMessage}`, {
				position: "top-center",
			});
		}
	};

	// 드롭 핸들러
	const handleDrop: DragEventHandler<HTMLTextAreaElement> = async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const files = Array.from(event.dataTransfer.files);
		const imageFiles = files.filter((file) => file.type.startsWith("image/"));

		if (imageFiles.length === 0) {
			toast.error("이미지 형식이 아닙니다!", {
				position: "top-center",
			});
			return;
		}

		imageFiles.forEach(async (imageFile) => {
			const convertedFile = await convertToWebp(imageFile);
			await handleUploadImage(convertedFile);
		});
	};

	// 붙여넣기 핸들러
	const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = async (
		event,
	) => {
		const items = Array.from(event.clipboardData.items);
		const imageItems = items.filter((item) => item.type.startsWith("image/"));

		// 이미지가 아니면 기본 붙여넣기 동작 수행
		if (imageItems.length === 0) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		imageItems.forEach(async (imageItem) => {
			const file = imageItem.getAsFile();
			if (!file) {
				toast.error("이미지를 가져올 수 없습니다!", {
					position: "top-center",
				});
				return;
			}
			const convertedFile = await convertToWebp(file);
			await handleUploadImage(convertedFile);
		});
	};

	return {
		handleDragOver,
		handleDrop,
		handlePaste,
		textareaRef,
	};
};
