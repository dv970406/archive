/**
 * 마크다운 텍스트를 일반 텍스트로 변환
 */
export const parseMarkdownToPlainText = (markdown: string) => {
	return (
		markdown
			// 코드 블록 제거
			.replace(/```[\s\S]*?```/g, "")
			// 인라인 코드 제거
			.replace(/`([^`]+)`/g, "$1")
			// 헤딩 (#, ##, ### 등)
			.replace(/^#{1,6}\s+/gm, "")
			// 볼드 (**text** 또는 __text__)
			.replace(/(\*\*|__)(.*?)\1/g, "$2")
			// 이탤릭 (*text* 또는 _text_)
			.replace(/(\*|_)(.*?)\1/g, "$2")
			// 취소선 (~~text~~)
			.replace(/~~(.*?)~~/g, "$1")
			// 링크 ([text](url))
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
			// 이미지 (![alt](url))
			.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
			// 블록 인용 (>)
			.replace(/^>\s+/gm, "")
			// 리스트 (* 또는 - 또는 +)
			.replace(/^[*\-+]\s+/gm, "")
			// 번호 리스트 (1. 2. 등)
			.replace(/^\d+\.\s+/gm, "")
			// 수평선 (---, ***, ___)
			.replace(/^([-*_])\1{2,}\s*$/gm, "")
			// 연속된 줄바꿈을 하나로
			.replace(/\n{2,}/g, "\n")
			// 앞뒤 공백 제거
			.trim()
	);
};
