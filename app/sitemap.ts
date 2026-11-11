import type { MetadataRoute } from "next";
import { getAllCategories } from "@/lib/content/categories";
import { getPublishedPosts } from "@/lib/content/posts";

// 글은 빌드 시점에 파일에서 읽으므로 사이트맵도 정적으로 생성된다
export default function sitemap(): MetadataRoute.Sitemap {
	const PRODUCTION_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

	const categoriesArray = getAllCategories().map((category) => ({
		url: `${PRODUCTION_URL}/category/${category.pathname}`,
	}));

	// 기존과 같이 마지막 수정일 오름차순으로 나열한다
	const postsArray = [...getPublishedPosts()]
		.sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt))
		.map((post) => ({
			url: `${PRODUCTION_URL}/post/${post.slug}`,
			lastModified: post.updatedAt,
		}));

	const availableUrlsArray: MetadataRoute.Sitemap = [
		// 피드 페이지
		{
			url: PRODUCTION_URL,
		},

		// 카테고리로 필터된 피드 페이지
		...categoriesArray,

		// 경력 페이지
		{
			url: `${PRODUCTION_URL}/career`,
		},

		// 모든 게시글 상세 페이지
		...postsArray,
	];

	return availableUrlsArray;
}
