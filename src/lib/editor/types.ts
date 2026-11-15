/** 에디터에서 편집하는 글 필드 */
export interface EditorDraft {
	slug: string;
	title: string;
	/** Category.pathname */
	category: string;
	/** /posts/<slug>/<파일> 또는 절대 URL */
	thumbnail: string | null;
	content: string;
}

export type EditorTab = "write" | "split" | "preview";
