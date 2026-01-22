import { create } from "zustand";
import type { Post } from "@/types/post";

interface IPostDraft extends Pick<
  Post,
  "title" | "content" | "thumbnail" | "id" | "slug"
> {
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
  },
}));

export const usePostDraft = () => {
  const postDraft = usePostStore((store) => store.postDraft);
  return postDraft;
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
