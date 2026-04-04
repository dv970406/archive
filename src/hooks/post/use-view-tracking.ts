import { useEffect } from "react";
import { useIncreasePostViewCount } from "@/hooks/mutations/post";
import { VIEWED_POSTS } from "@/lib/constant/storage-key";
import type { PostEntity } from "@/types/post";

/** 24시간(밀리초) */
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface IViewedPost {
	id: number;
	nextViewCountUpdateAt: number;
}

/** localStorage 기반 조회수 쿨다운을 관리하고, 조건 충족 시 조회수를 증가시키는 훅 */
export const useViewTracking = (id: PostEntity["id"]) => {
	const { mutate: increasePostViewCount } = useIncreasePostViewCount();

	useEffect(() => {
		const stringifiedViewedPostsArray = localStorage.getItem(VIEWED_POSTS);
		let parsedViewedPosts: IViewedPost[] = [];
		try {
			parsedViewedPosts = stringifiedViewedPostsArray
				? JSON.parse(stringifiedViewedPostsArray)
				: [];
		} catch {
			// localStorage 데이터가 손상된 경우 초기화
			localStorage.removeItem(VIEWED_POSTS);
		}

		const now = Date.now();

		const targetPost = parsedViewedPosts.find((post) => post.id === id);

		// 기록이 없거나 24시간이 지났으면 view count 증가
		const hasNeverViewed = !targetPost;
		const isViewCooldownExpired =
			!!targetPost && now >= targetPost.nextViewCountUpdateAt;

		if (hasNeverViewed || isViewCooldownExpired) {
			increasePostViewCount(id, {
				onSuccess: () => {
					// localStorage 업데이트
					const updatedViewedPosts = parsedViewedPosts.filter(
						(post) => post.id !== id,
					);
					updatedViewedPosts.push({
						id,
						nextViewCountUpdateAt: now + ONE_DAY_MS,
					});

					localStorage.setItem(
						VIEWED_POSTS,
						JSON.stringify(updatedViewedPosts),
					);
				},
			});
		}
	}, [id, increasePostViewCount]);
};
