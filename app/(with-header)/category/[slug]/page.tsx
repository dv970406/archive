import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { fetchAllCategories, fetchCategoryByPathname } from "@/api/category";
import CategoryFilter from "@/components/pages/index/category-filter";
import PostsList from "@/components/pages/index/posts-list";
import { getCategoryByPathnameQuery } from "@/hooks/queries/category";
import { getInfinitePostsQuery } from "@/hooks/queries/post";
import { getQueryClient } from "@/lib/utils/tanstack-query";

// 피드 페이지는 ISR로 5분간 캐싱 처리
export const revalidate = 300;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;

	const category = await fetchCategoryByPathname(slug);

	return {
		title: `${category.title ?? ""} 피드 목록`,
		description: `${category.title ?? ""} 피드 목록입니다.`,
		openGraph: {
			title: `${category.title ?? ""} 피드 목록`,
			description: `${category.title ?? ""} 피드 목록입니다.`,
		},
	};
}

export async function generateStaticParams() {
	const categories = await fetchAllCategories();

	return categories.map((category) => ({
		slug: category.pathname,
	}));
}

const FilteredFeedFage = async ({
	params,
}: {
	params: Promise<{ slug: string }>;
}) => {
	const { slug } = await params;
	const queryClient = getQueryClient();

	const category = await queryClient.fetchQuery(
		getCategoryByPathnameQuery(slug),
	);

	if (!category) return;
	await Promise.all([
		queryClient.prefetchInfiniteQuery(getInfinitePostsQuery(category.id)),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CategoryFilter />
			<PostsList />
		</HydrationBoundary>
	);
};

export default FilteredFeedFage;
