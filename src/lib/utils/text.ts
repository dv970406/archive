import { isValidElement, type ReactNode } from "react";

export const extractText = (node: ReactNode): string => {
	if (typeof node === "string") return node;
	if (typeof node === "number") return String(node);
	if (!node) return "";

	// 자식 태그가 추가로 있다면 그 태그의 텍스트도 재귀로 추출
	if (Array.isArray(node)) return node.map(extractText).join("");

	if (isValidElement<{ children?: ReactNode }>(node))
		return extractText(node.props.children);

	return "";
};

export const slugify = (text: string) =>
	text
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\p{L}\p{N}-]/gu, "");
