export type TCallout = (typeof CALLOUT_TYPES)[number];
export interface IMdxComponentConfig {
	id: string;
	label: string;
	snippet: string;
	options?: { id: string; label: string; snippet: string }[];
}

const CALLOUT_TYPES = ["info", "warning", "success", "error"] as const;

const CALLOUT_LABELS: Record<TCallout, string> = {
	info: "정보",
	warning: "경고",
	success: "성공",
	error: "에러",
};

const createCalloutSnippet = (type: TCallout) =>
	`<Callout type="${type}">\n내용을 입력하세요.\n</Callout>`;

const createImageGallerySnippet = () =>
	`<ImageGallery>\n\t<ImageGallery.Image src="" alt="" />\n\t<ImageGallery.Image src="" alt="" />\n</ImageGallery>`;

export const mdxComponentConfigs: IMdxComponentConfig[] = [
	{
		id: "callout",
		label: "Callout",
		snippet: createCalloutSnippet("info"),
		options: CALLOUT_TYPES.map((type) => ({
			id: type,
			label: CALLOUT_LABELS[type],
			snippet: createCalloutSnippet(type),
		})),
	},
	{
		id: "imageGallery",
		label: "ImageGallery",
		snippet: createImageGallerySnippet(),
	},
];
