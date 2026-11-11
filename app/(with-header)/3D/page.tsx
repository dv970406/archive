import dynamic from "next/dynamic";

import Loader from "@/components/ui/loader";
import { getPublishedPosts, toPostCard } from "@/lib/content/posts";
import {
	createCollectionPageJsonLd,
	createWebsiteJsonLd,
} from "@/lib/utils/jsonld";
import JsonLdProvider from "@/provider/jsonld-provider";

// THREE.js 번들을 별도 청크로 분리하여 다른 페이지의 초기 로딩에 영향을 주지 않음
const PostsList3D = dynamic(
	() => import("@/components/pages/index/posts-list-3d"),
	{ loading: () => <Loader /> },
);

// 모든 글은 빌드 시점에 content/ 에서 읽어 정적으로 생성된다
const FeedPage = () => {
	const posts = getPublishedPosts().map(toPostCard);

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

	const websiteJsonLd = createWebsiteJsonLd(siteUrl);
	const collectionPageJsonLd = createCollectionPageJsonLd({
		siteUrl,
		title: "최성준 아카이브",
		description:
			"프론트엔드 엔지니어 최성준의 아카이브입니다. 웹 개발, SEO 등 다양한 기술 주제를 다룹니다.",
	});

	return (
		<JsonLdProvider jsonLd={websiteJsonLd}>
			<JsonLdProvider jsonLd={collectionPageJsonLd}>
				<PostsList3D posts={posts} />
			</JsonLdProvider>
		</JsonLdProvider>
	);
};

export default FeedPage;
