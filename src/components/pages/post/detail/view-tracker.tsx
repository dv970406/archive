"use client";

import { useEffect } from "react";
import { useIncreasePostViewCount } from "@/hooks/mutations/post";
import { VIEWED_POSTS } from "@/lib/constant/storage-key";
import type { PostEntity } from "@/types/post";

interface IViewedPost {
	id: number;
	nextViewCountUpdateAt: number;
}

interface IViewTracker extends Pick<PostEntity, "id"> {}
const ViewTracker = ({ id }: IViewTracker) => {
	const { mutate: increasePostViewCount } = useIncreasePostViewCount();
	useEffect(() => {
		const stringifiedViewedPostsArray = localStorage.getItem(VIEWED_POSTS);
		const parsedViewedPosts: IViewedPost[] = stringifiedViewedPostsArray
			? JSON.parse(stringifiedViewedPostsArray)
			: [];

		const now = Date.now();

		const targetPost = parsedViewedPosts.find((post) => post.id === id);

		// 기록이 없거나 24시간이 지났으면 view count 증가
		if (!targetPost || now >= targetPost?.nextViewCountUpdateAt) {
			increasePostViewCount(id, {
				onSuccess: () => {
					const oneDayMs = 24 * 60 * 60 * 1000;

					// localStorage 업데이트
					const updatedViewedPosts = parsedViewedPosts.filter(
						(post) => post.id !== id,
					);
					updatedViewedPosts.push({
						id,
						nextViewCountUpdateAt: now + oneDayMs,
					});

					localStorage.setItem(
						VIEWED_POSTS,
						JSON.stringify(updatedViewedPosts),
					);
				},
			});
		}
	}, [id]);

	return null;
};

export default ViewTracker;
