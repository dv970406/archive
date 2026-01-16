import { useEffect } from "react";
import { toast } from "sonner";
import { useOpenAlertModal } from "@/store/alert-modal";
import {
  usePostDraft,
  useSetCategory,
  useSetContent,
  useSetPostId,
  useSetThumbnail,
  useSetTitle,
} from "@/store/post/use-post-draft";
import { useDeleteImagesInPathMutation } from "../mutations/image";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "../mutations/post";
import { useGetSavedPostDraft } from "../queries/post";

export const useSavedPostDraft = () => {
  const openAlertModal = useOpenAlertModal();

  const setPostId = useSetPostId();
  const setTitle = useSetTitle();
  const setContent = useSetContent();
  const setCategory = useSetCategory();
  const setThumbnail = useSetThumbnail();

  const { data: savedPostDraft, isPending: isSavedPostDraftPending } =
    useGetSavedPostDraft();

  const { mutate: deleteImagesInPath } = useDeleteImagesInPathMutation();
  const { mutate: updatePost } = useUpdatePostMutation();

  // DB post 테이블에 status 칼럼이 DRAFT인 로우가 있으면 가져옴
  useEffect(() => {
    if (isSavedPostDraftPending) return;

    if (!savedPostDraft) return;
    const { title, content, category, thumbnail, id } = savedPostDraft;

    openAlertModal({
      title: "임시저장된 글을 불러오시겠습니까?",
      description: "취소하시는 경우 기존 글은 삭제됩니다.",
      onPositive: () => {
        try {
          setPostId(id);
          setTitle(title);
          setContent(content);
          setCategory(category);
          setThumbnail(thumbnail);
        } catch {
          toast.error("불러오기에 실패했습니다");
        }
      },
      onNegative: () => {
        updatePost({
          id,
          title: "",
          content: "",
          category_id: null,
          thumbnail: null,
          status: "DRAFT",
          published_at: null,
        });
        // 경로 내의 썸네일과 이미 올라갔던 이미지들 모두 삭제
        deleteImagesInPath(`${savedPostDraft.id}`);
      },
    });
  }, [
    openAlertModal,
    setCategory,
    setContent,
    setTitle,
    setThumbnail,
    setPostId,
    isSavedPostDraftPending,
    savedPostDraft,
    deleteImagesInPath,
    updatePost,
  ]);

  const { mutate: createPost } = useCreatePostMutation();

  // 임시저장된 글이 없으면 DRAFT 글을 새로 생성
  useEffect(() => {
    if (isSavedPostDraftPending) return;
    if (savedPostDraft) return;
    createPost(
      {
        title: "",
        content: "",
        category_id: null,
        thumbnail: null,
      },
      {
        onSuccess: (receivedData) => {
          setPostId(receivedData.id);
          setTitle("");
          setContent("");
          setCategory(null);
          setThumbnail(null);
        },
      }
    );
  }, [
    createPost,
    savedPostDraft,
    isSavedPostDraftPending,
    setPostId,
    setTitle,
    setContent,
    setCategory,
    setThumbnail,
  ]);

  const postDraft = usePostDraft();

  // 입력된 데이터에 변화가 있으면 DB에 주기적으로 디바운스하여 저장
  useEffect(() => {
    const { category, content, title, thumbnail, id } = postDraft;
    if (!id) return;

    const isAnyDataExist = content || title || !!category || thumbnail;
    if (!isAnyDataExist) return;

    const debounce = setTimeout(() => {
      updatePost({
        id,
        title,
        content,
        category_id: category?.id ?? null,
        thumbnail,
        status: "DRAFT",
        published_at: null,
      });
    }, 1000); // 1000ms 디바운스

    return () => clearTimeout(debounce);
  }, [postDraft, updatePost]);
};

export type IUseSavedPostDraftReturn = ReturnType<typeof useSavedPostDraft>;
