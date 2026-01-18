import type { MetadataRoute } from "next";
import { fetchAllPostsForSitemap } from "@/api/post";

// 하루마다 갱신하도록 설정
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await fetchAllPostsForSitemap();

	const postsArray = posts.map((post) => ({
		url: `https://www.choiseongjun.com/post/${post.id}`,
		lastModified: post.updated_at,
	}));

	const availableUrlsArray: MetadataRoute.Sitemap = [
		// 피드 페이지
		{
			url: "https://www.choiseongjun.com",
		},

		// 경력 페이지
		{
			url: "https://www.choiseongjun.com/career",
		},

		// 모든 게시글 상세 페이지
		...postsArray,
	];

	return availableUrlsArray;
}
