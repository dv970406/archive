// 텍스트를 링크 기준으로 분할하는 유틸
export type TextPart =
	| { type: "text"; id: string; value: string }
	| { type: "link"; id: string; text: string; url: string };

interface ReduceState {
	parts: TextPart[];
	remaining: string;
	index: number;
}

const appendTextPart = (
	parts: TextPart[],
	value: string,
	index: number,
): { parts: TextPart[]; nextIndex: number } =>
	value
		? {
				parts: [...parts, { type: "text" as const, id: `t${index}`, value }],
				nextIndex: index + 1,
			}
		: { parts, nextIndex: index };

export const parseLinkedText = (
	text: string,
	links: { text: string; url: string }[],
): TextPart[] => {
	const sorted = [...links].sort(
		(a, b) => text.indexOf(a.text) - text.indexOf(b.text),
	);

	const { parts, remaining, index } = sorted.reduce<ReduceState>(
		(acc, link) => {
			const idx = acc.remaining.indexOf(link.text);
			if (idx === -1) return acc;

			const { parts: newParts, nextIndex } = appendTextPart(
				acc.parts,
				acc.remaining.slice(0, idx),
				acc.index,
			);

			return {
				parts: [
					...newParts,
					{
						type: "link",
						id: `l${nextIndex}`,
						text: link.text,
						url: link.url,
					},
				],
				remaining: acc.remaining.slice(idx + link.text.length),
				index: nextIndex + 1,
			};
		},
		{ parts: [], remaining: text, index: 0 },
	);

	return appendTextPart(parts, remaining, index).parts;
};
