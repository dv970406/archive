import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import type { CollectionPage, WithContext } from "schema-dts";
import { cachedAllCategories, fetchCategoryByPathname } from "@/api/category";
import CategoryFilter from "@/components/pages/index/category-filter";
import PostsList from "@/components/pages/index/posts-list";
import { getCategoryByPathnameQuery } from "@/hooks/queries/category";
import { getInfinitePostsQuery } from "@/hooks/queries/post";
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

	const collectionPageJsonLd: WithContext<CollectionPage> = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"@id": `${siteUrl}/category/${slug}#collectionpage`,
		url: `${siteUrl}/category/${slug}`,
		name: `${category.title} 피드 목록`,
		description: `${category.title} 관련 기술 블로그 글 목록입니다.`,
		isPartOf: {
			"@type": "WebSite",
			"@id": `${siteUrl}/#website`,
			name: "최성준 아카이브",
			url: siteUrl,
		},
		about: {
			"@type": "Thing",
			name: category.title,
		},
		author: {
			"@type": "Person",
			name: "최성준",
			url: siteUrl,
		},
		inLanguage: "ko-KR",
		breadcrumb: {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "홈",
					item: siteUrl,
				},
				{
					"@type": "ListItem",
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
