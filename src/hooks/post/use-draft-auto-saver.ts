import { useEffect } from "react";
import { usePostDraft } from "@/store/post/use-post-draft";
import { useUpdatePostMutation } from "../mutations/post";

/** 자동 저장 디바운스 지연 시간(밀리초) */
const AUTO_SAVE_DEBOUNCE_MS = 1000;

/**
 * 드래프트 자동 저장 훅
 * - 입력 데이터 변화 감지 시 디바운스하여 DB에 저장
 */
export const useDraftAutoSaver = () => {
	const postDraft = usePostDraft();
	const { mutate: updatePost } = useUpdatePostMutation();

	useEffect(() => {
		const { category, content, title, thumbnail, id, slug, status } = postDraft;
		if (!id) return;

		// 수정 화면을 거친 뒤 store에 남아 있는 발행 글(PUBLISHED/HIDDEN)을
		// 자동저장이 DRAFT로 덮어써 버리는 것을 막는다.
		// 특히 HIDDEN 글이 DRAFT가 되면 숨긴 글 목록에서도 사라져 복구가 불가능해진다.
		if (status !== "DRAFT") return;

		const isAnyDataExist = content || title || !!category || thumbnail || slug;
		if (!isAnyDataExist) return;

		const debounce = setTimeout(() => {
			updatePost({
				id,
				title,
				content,
				category_id: category?.id ?? null,
				thumbnail,
				status: "DRAFT",
				slug,
			});
		}, AUTO_SAVE_DEBOUNCE_MS);

		return () => clearTimeout(debounce);
	}, [postDraft, updatePost]);
};
