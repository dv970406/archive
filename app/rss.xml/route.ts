import { fetchAllPosts } from "@/api/post";

// 하루마다 갱신하도록 설정
export const revalidate = 86400;

export async function GET() {
	const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
	const posts = await fetchAllPosts();

	const rssItems = posts
		.map((post) => {
			const postUrl = `${SITE_URL}/post/${post.slug}`;
			const pubDate = post.published_at
				? new Date(post.published_at).toUTCString()
				: new Date(post.created_at).toUTCString();

			const rawDescription = post.ai_summary ?? post.title;
			const description = escapeXml(
				`${rawDescription}\n\n더 자세한 내용은 링크를 통해 확인하세요.`,
			);

			const categoryTag = post.category
				? `<category>${escapeXml(post.category.title)}</category>`
				: "";

			const thumbnailTag = post.thumbnail
				? `<enclosure url="${escapeXml(post.thumbnail)}" type="${getMimeType(post.thumbnail)}" length="0" />`
				: "";

			return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      ${categoryTag}
      ${thumbnailTag}
    </item>`;
		})
		.join("");

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>최성준 아카이브</title>
    <link>${SITE_URL}</link>
    <description>프론트엔드 엔지니어 최성준의 A to Z</description>
    <language>ko</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

	return new Response(rss, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
		},
	});
}

function escapeXml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function getMimeType(url: string): string {
	if (url.endsWith(".png")) return "image/png";
	if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "image/jpeg";
	if (url.endsWith(".gif")) return "image/gif";
	return "image/webp";
}
