import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CategoryFilter from "@/components/pages/index/category-filter";
import PostsList from "@/components/pages/index/posts-list";
import { getAllCategoriesQuery } from "@/hooks/queries/category";
import { getInfinitePostsQuery } from "@/hooks/queries/post";
import { getQueryClient } from "@/lib/utils/tanstack-query";

const HomePage = async ({
	searchParams,
}: {
	searchParams: { categoryId?: string };
}) => {
	const { categoryId } = await searchParams;

	const queryClient = getQueryClient();

	await Promise.all([
		queryClient.prefetchQuery(getAllCategoriesQuery),
		queryClient.prefetchInfiniteQuery(
			getInfinitePostsQuery(
				categoryId ? Number.parseInt(categoryId) : undefined,
			),
		),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CategoryFilter />
			<PostsList />
		</HydrationBoundary>
	);
};

export default HomePage;
