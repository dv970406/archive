import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import CategoryFilter from "@/components/pages/index/category-filter";
import PostsList from "@/components/pages/index/posts-list";
import { getInfinitePostsQuery } from "@/hooks/queries/post";
import { getQueryClient } from "@/lib/utils/tanstack-query";

// 피드 페이지는 ISR로 5분간 캐싱 처리
export const revalidate = 300;

const FeedPage = async () => {
	const queryClient = getQueryClient();

	await Promise.all([
		queryClient.prefetchInfiniteQuery(getInfinitePostsQuery()),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CategoryFilter />
			<PostsList />
		</HydrationBoundary>
	);
};

export default FeedPage;
