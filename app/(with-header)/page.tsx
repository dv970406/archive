import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import CategoryFilter from "@/components/pages/index/category-filter";
import PostsList from "@/components/pages/index/posts-list";
import { getInfinitePostsQuery } from "@/hooks/queries/post";
import {
	createCollectionPageJsonLd,
	createWebsiteJsonLd,
} from "@/lib/utils/jsonld";
import { getQueryClient } from "@/lib/utils/tanstack-query";
import JsonLdProvider from "@/provider/jsonld-provider";

// 피드 페이지는 ISR로 5분간 캐싱 처리
export const revalidate = 300;

const FeedPage = async () => {
	const queryClient = getQueryClient();

	await Promise.all([
		queryClient.prefetchInfiniteQuery(getInfinitePostsQuery()),
	]);

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

	const websiteJsonLd = createWebsiteJsonLd(siteUrl);
	const collectionPageJsonLd = createCollectionPageJsonLd({
		siteUrl,
		title: "최성준 아카이브",
		description:
			"프론트엔드 엔지니어 최성준의 아카이브입니다. 웹 개발, SEO 등 다양한 기술 주제를 다룹니다.",
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<JsonLdProvider jsonLd={websiteJsonLd}>
				<JsonLdProvider jsonLd={collectionPageJsonLd}>
					<CategoryFilter />
					<PostsList />
				</JsonLdProvider>
			</JsonLdProvider>
		</HydrationBoundary>
	);
};

export default FeedPage;
