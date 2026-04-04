import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { cachedAllCategories, fetchCategoryByPathname } from "@/api/category";
import CategoryFilter from "@/components/pages/index/category-filter";
import PostsList from "@/components/pages/index/posts-list";
import { getCategoryByPathnameQuery } from "@/hooks/queries/category";
import { getInfinitePostsQuery } from "@/hooks/queries/post";
import { createCollectionPageJsonLd } from "@/lib/utils/jsonld";
import { getQueryClient } from "@/lib/utils/tanstack-query";
import JsonLdProvider from "@/provider/jsonld-provider";

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
	const categories = await cachedAllCategories();

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

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

	const collectionPageJsonLd = {
		...createCollectionPageJsonLd({
			siteUrl,
			title: `${category.title} 피드 목록`,
			description: `${category.title} 관련 기술 블로그 글 목록입니다.`,
		}),
		"@id": `${siteUrl}/category/${slug}#collectionpage`,
		url: `${siteUrl}/category/${slug}`,
		isPartOf: {
			"@type": "WebSite" as const,
			"@id": `${siteUrl}/#website`,
			name: "최성준 아카이브",
			url: siteUrl,
		},
		about: {
			"@type": "Thing" as const,
			name: category.title,
		},
		breadcrumb: {
			"@type": "BreadcrumbList" as const,
			itemListElement: [
				{
					"@type": "ListItem" as const,
					position: 1,
					name: "홈",
					item: siteUrl,
				},
				{
					"@type": "ListItem" as const,
					position: 2,
					name: category.title,
					item: `${siteUrl}/category/${slug}`,
				},
			],
		},
	};

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<JsonLdProvider jsonLd={collectionPageJsonLd}>
				<CategoryFilter />
				<PostsList />
			</JsonLdProvider>
		</HydrationBoundary>
	);
};

export default FilteredFeedFage;
