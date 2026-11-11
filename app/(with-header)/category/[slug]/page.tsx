import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryFilter from "@/components/pages/index/category-filter";
import PostsList from "@/components/pages/index/posts-list";
import {
	getAllCategories,
	getCategoryByPathname,
} from "@/lib/content/categories";
import { getPostsByCategory, toPostCard } from "@/lib/content/posts";
import { createCollectionPageJsonLd } from "@/lib/utils/jsonld";
import JsonLdProvider from "@/provider/jsonld-provider";

// generateStaticParams 에 없는 카테고리는 404 (모든 카테고리가 빌드 시점에 정적으로 생성된다)
export const dynamicParams = false;

interface IFilteredFeedPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: IFilteredFeedPageProps): Promise<Metadata> {
	const { slug } = await params;

	const category = getCategoryByPathname(slug);
	if (!category) notFound();

	return {
		title: `${category.title} 피드 목록`,
		description: `${category.title} 피드 목록입니다.`,
		openGraph: {
			title: `${category.title} 피드 목록`,
			description: `${category.title} 피드 목록입니다.`,
		},
	};
}

export function generateStaticParams() {
	return getAllCategories().map((category) => ({
		slug: category.pathname,
	}));
}

const FilteredFeedPage = async ({ params }: IFilteredFeedPageProps) => {
	const { slug } = await params;

	const category = getCategoryByPathname(slug);
	if (!category) notFound();

	const posts = getPostsByCategory(category.pathname).map(toPostCard);

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
		<JsonLdProvider jsonLd={collectionPageJsonLd}>
			<CategoryFilter />
			<PostsList posts={posts} />
		</JsonLdProvider>
	);
};

export default FilteredFeedPage;
