import { useEffect } from "react";
import { toast } from "sonner";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useSetDraft } from "@/store/post/use-post-draft";
import { useDeleteImagesInPathMutation } from "../mutations/image";
import {
	useCreatePostMutation,
	useUpdatePostMutation,
} from "../mutations/post";
import { useGetSavedPostDraft } from "../queries/post";

/**
 * 드래프트 로딩/생성 훅
 * - 기존 임시저장된 드래프트가 있으면 불러올지 삭제할지 사용자에게 확인
 * - 없으면 새 드래프트를 생성
 */
export const useDraftLoader = () => {
	const openAlertModal = useOpenAlertModal();
	const setDraft = useSetDraft();

	const { data: savedPostDraft, isPending: isSavedPostDraftPending } =
		useGetSavedPostDraft();

	const { mutate: deleteImagesInPath } = useDeleteImagesInPathMutation();
	const { mutate: updatePost } = useUpdatePostMutation();

	// DB post 테이블에 status 칼럼이 DRAFT인 로우가 있으면 가져옴
	useEffect(() => {
		if (isSavedPostDraftPending) return;

		if (!savedPostDraft) return;
		const { title, content, category, thumbnail, id, slug } = savedPostDraft;

		openAlertModal({
			title: "임시저장된 글을 불러오시겠습니까?",
			description: "취소하시는 경우 기존 글은 삭제됩니다.",
			onPositive: () => {
				try {
					setDraft({ id, title, content, category, thumbnail, slug });
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
					slug: "",
				});
				// 경로 내의 썸네일과 이미 올라갔던 이미지들 모두 삭제
				deleteImagesInPath(`${savedPostDraft.id}`);
			},
		});
	}, [
		openAlertModal,
		setDraft,
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
				slug: "",
				ai_summary: null,
			},
			{
				onSuccess: (receivedData) => {
					setDraft({
						id: receivedData.id,
						title: "",
						content: "",
						category: null,
						thumbnail: null,
						slug: "",
					});
				},
			},
		);
	}, [createPost, savedPostDraft, isSavedPostDraftPending, setDraft]);
};
