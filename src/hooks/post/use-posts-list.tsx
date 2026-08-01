import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useInfiniteScrollTrigger } from "../common/use-infinite-scroll-trigger";
import { useGetUser } from "../queries/auth";
import { useCategoryByPathname } from "../queries/category";
import { useGetHiddenPosts, useGetInfinitePosts } from "../queries/post";

const getSortTime = (post: {
	published_at: string | null;
	created_at: string;
}) => new Date(post.published_at ?? post.created_at).getTime();

export const usePostsList = () => {
	const params = useParams();
	const slug = params.slug as string | undefined;

	const { data: category } = useCategoryByPathname(slug ?? "");
	const {
		data: postsData,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useGetInfinitePosts(category?.id);

	// 숨긴 글은 어드민에게만 피드에 함께 노출한다.
	// 비로그인 사용자는 쿼리 자체가 실행되지 않고, 설령 실행돼도 RLS가 빈 배열을 반환한다.
	const { data: userData } = useGetUser();
	const isSignedIn = !!userData?.user?.id;
	const { data: hiddenPosts } = useGetHiddenPosts({ enabled: isSignedIn });

	const publishedList = postsData?.pages.flat();
	const categoryId = category?.id;

	const postsList = useMemo(() => {
		if (!publishedList) return publishedList;
		if (!isSignedIn || !hiddenPosts?.length) return publishedList;

		// 카테고리 피드에서는 해당 카테고리의 숨긴 글만 섞는다
		const scopedHiddenPosts = categoryId
			? hiddenPosts.filter((post) => post.category_id === categoryId)
			: hiddenPosts;

		if (!scopedHiddenPosts.length) return publishedList;

		return [...publishedList, ...scopedHiddenPosts].sort(
			(a, b) => getSortTime(b) - getSortTime(a),
		);
	}, [publishedList, hiddenPosts, isSignedIn, categoryId]);

	const { observerRef } = useInfiniteScrollTrigger({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	});

	return {
		postsList,
		observerRef,
		isFetchingNextPage,
	};
};
