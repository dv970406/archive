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
		const { category, content, title, thumbnail, id, slug } = postDraft;
		if (!id) return;

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
