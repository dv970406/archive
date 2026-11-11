import { getPublishedPosts } from "@/lib/content/posts";
import { toAbsoluteUrl } from "@/lib/utils/url";

// 글은 빌드 시점에 파일에서 읽으므로 RSS 도 정적으로 생성한다
export const dynamic = "force-static";

export async function GET() {
	const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
	const posts = getPublishedPosts();

	const rssItems = posts
		.map((post) => {
			const postUrl = `${SITE_URL}/post/${post.slug}`;
			const pubDate = new Date(post.publishedAt).toUTCString();

			const rawDescription = post.summary ?? post.title;
			const description = escapeXml(
				`${rawDescription}\n\n더 자세한 내용은 링크를 통해 확인하세요.`,
			);

			const categoryTag = `<category>${escapeXml(post.category.title)}</category>`;

			const thumbnailTag = post.thumbnail
				? `<enclosure url="${escapeXml(toAbsoluteUrl(post.thumbnail))}" type="${inferMimeTypeFromUrl(post.thumbnail)}" length="0" />`
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

const DEFAULT_IMAGE_MIME_TYPE = "image/webp";

function inferMimeTypeFromUrl(url: string): string {
	if (url.endsWith(".png")) return "image/png";
	if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "image/jpeg";
	if (url.endsWith(".gif")) return "image/gif";
	return DEFAULT_IMAGE_MIME_TYPE;
}
