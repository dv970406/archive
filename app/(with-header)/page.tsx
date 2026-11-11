import CategoryFilter from "@/components/pages/index/category-filter";
import PostsList from "@/components/pages/index/posts-list";
import { getPublishedPosts, toPostCard } from "@/lib/content/posts";
import {
	createCollectionPageJsonLd,
	createWebsiteJsonLd,
} from "@/lib/utils/jsonld";
import JsonLdProvider from "@/provider/jsonld-provider";

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
				<CategoryFilter />
				<PostsList posts={posts} />
			</JsonLdProvider>
		</JsonLdProvider>
	);
};

export default FeedPage;
