import type { MetadataRoute } from "next";
import { fetchAllCategoriesForUtils } from "@/api/category";
import { fetchAllPostsForUtils } from "@/api/post";

// 하루마다 갱신하도록 설정
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const PRODUCTION_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
	const categories = await fetchAllCategoriesForUtils();
	const categoriesArray = categories.map((category) => ({
		url: `${PRODUCTION_URL}/category/${category.pathname}`,
	}));

	const posts = await fetchAllPostsForUtils();
	const postsArray = posts.map((post) => ({
		url: `${PRODUCTION_URL}/post/${post.slug}`,
		lastModified: post.updated_at,
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
