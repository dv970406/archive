import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/lib/query-keys";
import { usePostDraftField, useSetStatus } from "@/store/post/use-post-draft";
import type { Post, PostStatus } from "@/types/post";
import { useUpdatePostMutation } from "../mutations/post";

// 토스트 위치 상수
const TOAST_POSITION = "top-center" as const;

/**
 * 발행된 글의 공개/숨김 전환 훅
 * - PUBLISHED ↔ HIDDEN 만 전환한다 (DRAFT는 대상이 아님)
 * - published_at / updated_at은 절대 갱신하지 않는다.
 *   published_at을 건드리면 피드 정렬(NULLS FIRST)과 이전/다음 글 계산이 깨지고,
 *   updated_at을 건드리면 sitemap.lastModified와 JSON-LD dateModified가 오염된다.
 */
export const useTogglePostVisibility = () => {
	const id = usePostDraftField("id");
	const status = usePostDraftField("status");
	const setStatus = useSetStatus();

	// 캐시 키는 라우트 파라미터 기준이다. store의 slug는 에디터에서 수정될 수 있어 쓰면 안 된다.
	const { slug } = useParams();
	const routeSlug = slug as string | undefined;

	const queryClient = useQueryClient();
	const { mutate: updatePost, isPending } = useUpdatePostMutation();

	const isHidden = status === "HIDDEN";
	// DRAFT를 HIDDEN으로 바꾸면 임시저장 조회(status=DRAFT)에서 사라져 영구히 접근 불가해진다
	const canToggle = status === "PUBLISHED" || isHidden;

	const handleTogglePostVisibility = () => {
		if (!id || isPending || !canToggle) return;

		const nextStatus: PostStatus = isHidden ? "PUBLISHED" : "HIDDEN";

		updatePost(
			{ id, status: nextStatus },
			{
				onSuccess: () => {
					setStatus(nextStatus);

					// bySlug 캐시의 status도 함께 갱신한다.
					// 갱신하지 않으면 이 화면을 떠났다가 gcTime(10분) 안에 다시 들어왔을 때
					// refetchOnMount:false 때문에 옛 status가 store에 복원되고,
					// 그 상태로 저장하면 숨긴 글이 조용히 다시 공개된다.
					// refetch가 아니라 setQueryData로 status만 패치하므로
					// 작성 중이던 제목/본문은 덮어쓰지 않는다.
					if (routeSlug) {
						queryClient.setQueryData(
							QUERY_KEYS.post.bySlug(routeSlug),
							(prev: Post | undefined) =>
								prev ? { ...prev, status: nextStatus } : prev,
						);
					}

					toast.success(
						isHidden ? "포스트를 공개했습니다" : "포스트를 숨겼습니다",
						{
							position: TOAST_POSITION,
						},
					);

					// 전역 기본값이 refetchOnMount:false라, 비활성 쿼리는 invalidate만 하면
					// 다시 마운트돼도 refetch되지 않는다. data를 비우는 reset이어야 갱신된다.
					queryClient.resetQueries({
						queryKey: QUERY_KEYS.post.lists,
					});
					queryClient.resetQueries({
						queryKey: QUERY_KEYS.post.all,
					});
					queryClient.resetQueries({
						queryKey: QUERY_KEYS.post.hidden,
					});
				},
				onError: () => {
					toast.error(
						isHidden
							? "포스트 공개에 실패했습니다"
							: "포스트 숨기기에 실패했습니다",
						{
							position: TOAST_POSITION,
						},
					);
				},
			},
		);
	};

	return {
		isHidden,
		canToggle,
		isTogglePending: isPending,
		handleTogglePostVisibility,
	};
};
