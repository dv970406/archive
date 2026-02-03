import { usePostDraft, useSetContent } from "@/store/post/use-post-draft";

export const useTextareaController = (textareaId: string) => {
	const { content } = usePostDraft();
	const setContent = useSetContent();

	// 현재 커서 위치에 텍스트 삽입
	const insertTextAtCursor = (text: string) => {
		// useRef보다 가독성이 훨씬 좋고, 유일한 하나의 id만 사용하기에 중복문제 없음
		const textareaEl = document.getElementById(
			textareaId,
		) as HTMLTextAreaElement;

		if (!textareaEl) return;

		const { selectionStart, selectionEnd } = textareaEl;

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
			textareaEl.selectionStart = textareaEl.selectionEnd = newCursorPos;
			textareaEl.focus();
		}, 0);
	};

	return {
		insertTextAtCursor,
	};
};
