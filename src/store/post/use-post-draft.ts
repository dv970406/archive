import { create } from "zustand";
import type { Post } from "@/types/post";

interface IPostDraft
	extends Pick<Post, "title" | "content" | "thumbnail" | "id" | "slug"> {
	category: Post["category"] | null;
}

const initialState: IPostDraft = {
	id: 0,
	title: "",
	content: "",
	category: null,
	thumbnail: null,
	slug: "",
};

export interface IPostStore {
	postDraft: IPostDraft;
	actions: {
		setPostId: (id: IPostDraft["id"]) => void;
		setTitle: (title: IPostDraft["title"]) => void;
		setContent: (content: IPostDraft["content"]) => void;
		setCategory: (category: IPostDraft["category"]) => void;
		setThumbnail: (thumbnail: IPostDraft["thumbnail"]) => void;
		setSlug: (slug: IPostDraft["slug"]) => void;
		// 여러 필드를 한 번에 설정 — 개별 setter 6번 호출 대비 리렌더링 1회로 감소
		setDraft: (draft: IPostDraft) => void;
	};
}

const usePostStore = create<IPostStore>((set) => ({
	postDraft: initialState,
	actions: {
		setPostId: (postId) => {
			set((prev) => ({
				...prev,
				postDraft: {
					...prev.postDraft,
					id: postId,
				},
			}));
		},
		setTitle: (title) => {
			set((prev) => ({
				...prev,
				postDraft: {
					...prev.postDraft,
					title,
				},
			}));
		},
		setContent: (content) => {
			set((prev) => ({
				...prev,
				postDraft: {
					...prev.postDraft,
					content,
				},
			}));
		},
		setCategory: (category) => {
			set((prev) => ({
				...prev,
				postDraft: {
					...prev.postDraft,
					category,
				},
			}));
		},
		setThumbnail: (thumbnail) => {
			set((prev) => ({
				...prev,
				postDraft: {
					...prev.postDraft,
					thumbnail,
				},
			}));
		},
		setSlug: (slug) => {
			set((prev) => ({
				...prev,
				postDraft: {
					...prev.postDraft,
					slug,
				},
			}));
		},
		setDraft: (draft) => {
			set((prev) => ({
				...prev,
				postDraft: { ...prev.postDraft, ...draft },
			}));
		},
	},
}));

export const usePostDraft = () => {
	const postDraft = usePostStore((store) => store.postDraft);
	return postDraft;
};

// 필드별 선택적 구독 — 해당 필드 변경 시에만 리렌더링
export const usePostDraftField = <K extends keyof IPostDraft>(field: K) => {
	return usePostStore((store) => store.postDraft[field]);
};

export const useSetPostId = () => {
	const setPostId = usePostStore((store) => store.actions.setPostId);
	return setPostId;
};

export const useSetTitle = () => {
	const setTitle = usePostStore((store) => store.actions.setTitle);
	return setTitle;
};

export const useSetContent = () => {
	const setContent = usePostStore((store) => store.actions.setContent);
	return setContent;
};

export const useSetCategory = () => {
	const setCategory = usePostStore((store) => store.actions.setCategory);
	return setCategory;
};

export const useSetThumbnail = () => {
	const setThumbnail = usePostStore((store) => store.actions.setThumbnail);
	return setThumbnail;
};

export const useSetSlug = () => {
	const setSlug = usePostStore((store) => store.actions.setSlug);
	return setSlug;
};

export const useSetDraft = () => {
	const setDraft = usePostStore((store) => store.actions.setDraft);
	return setDraft;
};

// 렌더 없이 content 변경 감지 (MdxPreview용)
export const subscribeContent = (callback: (content: string) => void) =>
	usePostStore.subscribe((state, prevState) => {
		if (state.postDraft.content !== prevState.postDraft.content) {
			callback(state.postDraft.content);
		}
	});

export const getContent = () => usePostStore.getState().postDraft.content;
