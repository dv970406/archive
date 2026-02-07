import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { CollectionPage, WebSite, WithContext } from "schema-dts";

import PostsList3D from "@/components/pages/index/posts-list-3d";
import { getAllPostQuery } from "@/hooks/queries/post";
import { getQueryClient } from "@/lib/utils/tanstack-query";
import JsonLdProvider from "@/provider/jsonld-provider";

// 피드 페이지는 ISR로 5분간 캐싱 처리
export const revalidate = 300;

const FeedPage = async () => {
	const queryClient = getQueryClient();

	await Promise.all([queryClient.prefetchQuery(getAllPostQuery)]);

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

	const websiteJsonLd: WithContext<WebSite> = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${siteUrl}/#website`,
		url: siteUrl,
		name: "최성준 아카이브",
		description:
			"프론트엔드 개발자 최성준의 기술 블로그입니다. 웹 개발, React, Next.js, TypeScript 등 다양한 기술 주제를 다룹니다.",
		publisher: {
			"@type": "Person",
			name: "최성준",
			url: siteUrl,
		},
		inLanguage: "ko-KR",
	};

	const collectionPageJsonLd: WithContext<CollectionPage> = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"@id": `${siteUrl}/#collectionpage`,
		url: siteUrl,
		name: "최성준 아카이브",
		description:
			"프론트엔드 엔지니어 최성준의 아카이브입니다. 웹 개발, SEO 등 다양한 기술 주제를 다룹니다.",
		isPartOf: {
			"@type": "WebSite",
			"@id": `${siteUrl}/#website`,
		},
		about: {
			"@type": "Thing",
			name: "웹 개발",
		},
		author: {
			"@type": "Person",
			name: "최성준",
			url: siteUrl,
		},
		inLanguage: "ko-KR",
	};

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<JsonLdProvider jsonLd={websiteJsonLd}>
				<JsonLdProvider jsonLd={collectionPageJsonLd}>
					<PostsList3D />
				</JsonLdProvider>
			</JsonLdProvider>
		</HydrationBoundary>
	);
};

export default FeedPage;
