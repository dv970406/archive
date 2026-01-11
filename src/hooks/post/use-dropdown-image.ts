import { type DragEventHandler, useRef } from "react";
import { toast } from "sonner";
import { useUploadImageMutation } from "../mutations/image";

interface IUseDropdownImageProps {
	postId: number;
	content: string;
	setContent: (content: string) => void;
}
export const useDropdownImage = ({
	postId,
	content,
	setContent,
}: IUseDropdownImageProps) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { mutate: uploadImage } = useUploadImageMutation();

	// 특정 위치에 텍스트 삽입
	const insertTextAtCursor = (text: string) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const before = content.substring(0, start);
		const after = content.substring(end);

		const newContent = before + text + after;
		setContent(newContent);

		// 커서 위치를 삽입된 텍스트 뒤로 이동
		setTimeout(() => {
			textarea.selectionStart = textarea.selectionEnd = start + text.length;
			textarea.focus();
		}, 0);
	};

	// 드래그 오버 핸들러
	const handleDragOver: DragEventHandler<HTMLTextAreaElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	// 드롭 핸들러
	const handleDrop: DragEventHandler<HTMLTextAreaElement> = async (event) => {
		event.preventDefault();
		event.stopPropagation();

		const files = Array.from(event.dataTransfer.files);
		const imageFiles = files.filter((file) => file.type.startsWith("image/"));

		const imageFile = imageFiles[0];

		if (!imageFile) {
			toast.error("이미지 형식이 아닙니다!", {
				position: "top-center",
			});
			return;
		}

		// 드롭한 위치로 커서 이동
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.focus();
			// 드롭한 위치의 문자 인덱스 계산 (근사치)
			const rect = textarea.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			// 클릭한 위치를 기반으로 커서 위치 설정
			const position = getCaretPositionFromPoint(x, y);
			if (position !== null) {
				textarea.setSelectionRange(position, position);
			}
		}

		const timestamp = Date.now();
		const randomString = crypto.randomUUID();
		const fileExt = imageFile.name.split(".").pop();
		// 고유한 파일명 생성
		const filePath = `${postId}/${timestamp}-${randomString}.${fileExt}`;
		uploadImage(
			{ file: imageFile, filePath },
			{
				onSuccess: (receivedData) => {
					// 드랍한 위치에 이미지를 마크다운 문법으로 추가
					const imageMarkdown = `![${imageFile.name}](${receivedData})\n`;
					insertTextAtCursor(imageMarkdown);
				},
				onError: (error) => {
					toast.error(error.message, {
						position: "top-center",
					});
				},
			},
		);
	};

	// 드롭한 좌표에서 텍스트 커서 위치 계산
	const getCaretPositionFromPoint = (x: number, y: number): number | null => {
		// 브라우저의 caretPositionFromPoint 또는 caretRangeFromPoint 사용
		if (document.caretPositionFromPoint) {
			const position = document.caretPositionFromPoint(x, y);
			return position?.offset ?? null;
		}
		if (document.caretRangeFromPoint) {
			const range = document.caretRangeFromPoint(x, y);
			return range?.startOffset ?? null;
		}
		return null;
	};

	return {
		handleDragOver,
		handleDrop,
		textareaRef,
	};
};
