import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import dynamic from "next/dynamic";

import Loader from "@/components/ui/loader";
import { getAllPostsQuery } from "@/hooks/queries/post";
import {
	createCollectionPageJsonLd,
	createWebsiteJsonLd,
} from "@/lib/utils/jsonld";
import { getQueryClient } from "@/lib/utils/tanstack-query";
import JsonLdProvider from "@/provider/jsonld-provider";

// THREE.js 번들을 별도 청크로 분리하여 다른 페이지의 초기 로딩에 영향을 주지 않음
const PostsList3D = dynamic(
	() => import("@/components/pages/index/posts-list-3d"),
	{ loading: () => <Loader /> },
);

// 피드 페이지는 ISR로 5분간 캐싱 처리
export const revalidate = 300;

const FeedPage = async () => {
	const queryClient = getQueryClient();

	await Promise.all([queryClient.prefetchQuery(getAllPostsQuery)]);

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
					<PostsList3D />
				</JsonLdProvider>
			</JsonLdProvider>
		</HydrationBoundary>
	);
};

export default FeedPage;
