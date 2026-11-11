import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";
import Giscus from "@/components/pages/post/detail/giscus";
import PostCopyright from "@/components/pages/post/detail/post-copyright";
import PostDetailBody from "@/components/pages/post/detail/post-detail-body";
import PostDetailHeader from "@/components/pages/post/detail/post-detail-header";
import PostNavigation from "@/components/pages/post/detail/post-navigation";
import { PLACEHOLDER_THUMBNAIL_PATH } from "@/lib/constant/image";
import {
	getAdjacentPosts,
	getPostBySlug,
	getPublishedPosts,
} from "@/lib/content/posts";
import { toAbsoluteUrl } from "@/lib/utils/url";
import JsonLdProvider from "@/provider/jsonld-provider";

// generateStaticParams 에 없는 slug 는 404 (모든 글이 빌드 시점에 정적으로 생성된다)
export const dynamicParams = false;

interface IPostDetailPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: IPostDetailPageProps): Promise<Metadata> {
	const { slug } = await params;

	const post = getPostBySlug(slug);
	if (!post) notFound();

	const description = post.summary || `${post.title} - written by 최성준`;

	return {
		title: post.title,
		description,
		openGraph: {
			title: post.title,
			description,
			images: [
				{
					// OG 이미지는 절대 URL 이어야 한다
					url: toAbsoluteUrl(post.thumbnail ?? PLACEHOLDER_THUMBNAIL_PATH),
					width: 1200,
					height: 630,
				},
			],
		},
	};
}

export function generateStaticParams() {
	return getPublishedPosts().map((post) => ({
		slug: post.slug,
	}));
}

const PostDetailPage = async ({ params }: IPostDetailPageProps) => {
	const { slug } = await params;

	const post = getPostBySlug(slug);
	if (!post) notFound();

	const {
		title,
		category,
		thumbnail,
		summary,
		publishedAt,
		updatedAt,
		content,
	} = post;

	// 같은 카테고리 내 이전/다음 글
	const adjacentPosts = getAdjacentPosts(post);

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

	const jsonLd: WithContext<BlogPosting> = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: title,
		description: summary ?? undefined,
		image: thumbnail ? toAbsoluteUrl(thumbnail) : undefined,
		datePublished: publishedAt,
		dateModified: updatedAt,
		dateCreated: publishedAt,
		articleSection: category.title,
		author: {
			"@type": "Person",
			name: "최성준",
			url: siteUrl,
			jobTitle: "프론트엔드 엔지니어",
		},
		publisher: {
			"@type": "Person",
			name: "최성준",
			url: siteUrl,
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${siteUrl}/post/${slug}`,
		},
	};

	return (
		<JsonLdProvider jsonLd={jsonLd}>
			<main className="mx-auto py-12 max-w-3xl">
				<Link
					href="/"
					className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 w-fit"
				>
					<ArrowLeft className="w-4 h-4" />
					<span>목록으로</span>
				</Link>

				<PostDetailHeader
					category={category}
					title={title}
					publishedAt={publishedAt}
					thumbnail={thumbnail}
				/>

				<PostDetailBody content={content} />

				<PostCopyright publishedAt={publishedAt} />

				<PostNavigation next={adjacentPosts.next} prev={adjacentPosts.prev} />

				<Giscus />
			</main>
		</JsonLdProvider>
	);
};

export default PostDetailPage;
