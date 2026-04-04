import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/lib/query-keys";
import { usePostDraft } from "@/store/post/use-post-draft";
import { useGenerateSummarizeMutation } from "../mutations/ai";
import { useUpdatePostMutation } from "../mutations/post";

// 토스트 위치 상수
const TOAST_POSITION = "top-center" as const;

// 포스트 발행 전 유효성 검사
const validatePublishPost = ({
	id,
	category,
	title,
	slug,
}: {
	id: number;
	category: { id: number } | null;
	title: string;
	slug: string;
}): boolean => {
	if (!id) return false;
	if (!category) {
		toast.error("카테고리를 선택해주세요.", {
			position: TOAST_POSITION,
		});
		return false;
	}
	if (title.trim() === "") {
		toast.error("제목을 입력해주세요.", {
			position: TOAST_POSITION,
		});
		return false;
	}
	if (slug.trim() === "") {
		toast.error("경로를 입력해주세요.", {
			position: TOAST_POSITION,
		});
		return false;
	}
	return true;
};

export const usePublishPostWithAISummary = ({
	type,
}: {
	type: "CREATE" | "UPDATE";
}) => {
	const { category, content, title, thumbnail, id, slug } = usePostDraft();

	const { replace } = useRouter();
	const { mutate: updatePost, isPending: isPublishPostPending } =
		useUpdatePostMutation();

	const queryClient = useQueryClient();
	const { mutate: generateSummarize, isPending: isGenerateSummarizePending } =
		useGenerateSummarizeMutation();

	const isPending = isGenerateSummarizePending || isPublishPostPending;

	const handlePublishPost = async () => {
		if (!validatePublishPost({ id, category, title, slug })) return;
		if (isPending) return;
		// validatePublishPost 통과 후이므로 category는 non-null
		if (!category) return;

		// content를 claude ai가 요약을 한 후에 포스트의 create/update를 진행한다.

		generateSummarize(content, {
			onSuccess: (summarizedContent) => {
				const now = new Date().toISOString();
				updatePost(
					{
						id,
						title,
						content,
						category_id: category.id,
						thumbnail,
						status: "PUBLISHED",
						updated_at: now,
						slug,
						ai_summary: summarizedContent,
						...(type === "CREATE" && {
							published_at: now,
						}),
					},
					{
						onSuccess: () => {
							toast.success("포스트 발행에 성공했습니다", {
								position: TOAST_POSITION,
							});
							queryClient.resetQueries({
								queryKey: QUERY_KEYS.post.list(category.id),
							});
							queryClient.invalidateQueries({
								queryKey: QUERY_KEYS.post.all,
							});

							if (type === "UPDATE") {
								queryClient.invalidateQueries({
									queryKey: QUERY_KEYS.post.bySlug(slug),
								});
								replace(`/post/${slug}`);
							} else {
								replace("/");
							}
						},
						onError: () => {
							toast.error("포스트 발행에 실패했습니다", {
								position: TOAST_POSITION,
							});
						},
					},
				);
			},
			onError: () => {
				toast.error("AI 요약 생성에 실패했습니다. 다시 시도해주세요.", {
					position: TOAST_POSITION,
				});
			},
		});
	};

	return {
		isPending,
		handlePublishPost,
	};
};

export type IUsePublishPostWithAISummaryReturn = ReturnType<
	typeof usePublishPostWithAISummary
>;
