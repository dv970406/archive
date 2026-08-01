import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
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
	const { category, content, title, thumbnail, id, slug, status } =
		usePostDraft();

	const { replace } = useRouter();

	// bySlug 캐시 키는 라우트 파라미터 기준이다.
	// store의 slug는 에디터에서 변경될 수 있어 캐시 키로 쓰면 옛 엔트리가 남는다.
	const { slug: routeSlugParam } = useParams();
	const routeSlug = routeSlugParam as string | undefined;
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

		// 숨긴 글을 수정 후 저장할 때 의도치 않게 공개되지 않도록 HIDDEN을 유지
		const nextStatus =
			type === "UPDATE" && status === "HIDDEN" ? "HIDDEN" : "PUBLISHED";

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
						status: nextStatus,
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
							// list(categoryId)로 무효화하면 categoryId가 다른 쿼리(피드는 undefined)와
							// 매치되지 않으므로 공통 접두사인 lists를 사용한다
							// 전역 기본값이 refetchOnMount:false라 invalidate만으로는
							// 비활성 쿼리가 재마운트 시에도 갱신되지 않는다
							queryClient.resetQueries({
								queryKey: QUERY_KEYS.post.lists,
							});
							queryClient.resetQueries({
								queryKey: QUERY_KEYS.post.all,
							});
							queryClient.resetQueries({
								queryKey: QUERY_KEYS.post.hidden,
							});

							if (type === "UPDATE") {
								// invalidate는 refetchOnMount:false 탓에 재마운트해도 갱신되지 않는다.
								// 캐시를 아예 제거해야 다음 진입 시 저장 전 데이터로 되돌아가지 않는다.
								if (routeSlug) {
									queryClient.removeQueries({
										queryKey: QUERY_KEYS.post.bySlug(routeSlug),
									});
								}
								// 숨긴 글의 상세 페이지는 404이므로 피드로 보낸다
								replace(nextStatus === "HIDDEN" ? "/" : `/post/${slug}`);
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
