import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAllPostsForUtils, fetchPostBySlug } from "@/api/post";
import Giscus from "@/components/pages/post/detail/giscus";
import PostDetailBody from "@/components/pages/post/detail/post-detail-body";
import PostDetailHeader from "@/components/pages/post/detail/post-detail-header";
import ViewTracker from "@/components/pages/post/detail/view-tracker";
import { getPostBySlugQuery } from "@/hooks/queries/post";
import { PLACEHOLDER_THUMBNAIL_PATH } from "@/lib/constant/image";
import { parseMarkdownToPlainText } from "@/lib/utils/markdown";
import { getQueryClient } from "@/lib/utils/tanstack-query";

// 포스트 상세 페이지는 ISR로 5분간 캐싱 처리
export const revalidate = 300;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;

	// metadata단의 아래코드와 페이지단에서 getPostBySlugQuery의 요청문인 fetchPostBySlug까지 총 두번 요청할 것처럼 보여도 '리퀘스트 메모이제이션'에 의해 한번만 요청됨
	const postData = await fetchPostBySlug(slug);

	return {
		title: postData.title ?? "",
		description: parseMarkdownToPlainText(postData.content),
		openGraph: {
			title: postData.title ?? "",
			description: `${postData.title} - written by 최성준`,
			images: [
				{
					url:
						postData.thumbnail ??
						process.env.NEXT_PUBLIC_SITE_URL + PLACEHOLDER_THUMBNAIL_PATH,
					width: 1200,
					height: 630,
				},
			],
		},
	};
}

export async function generateStaticParams() {
	const posts = await fetchAllPostsForUtils();

	return posts.map((post) => ({
		slug: post.slug,
	}));
}

const PostDetailPage = async ({
	params,
}: {
	params: Promise<{ slug: string }>;
}) => {
	const { slug } = await params;
	const queryClient = getQueryClient();

	// 헤더, 바디 컴포넌트를 서버 컴포넌트로만 구현하기 위해 useQuery를 사용하지 않음
	const postData = await queryClient.fetchQuery(getPostBySlugQuery(slug));

	if (!postData) {
		notFound();
	}

	const {
		id,
		category,
		title,
		content,
		created_at,
		view_count,
		published_at,
		thumbnail,
	} = postData;

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
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
					view_count={view_count}
					created_at={created_at}
					published_at={published_at}
					thumbnail={thumbnail}
				/>

				<PostDetailBody content={content} />

				<Giscus />
			</main>
			<ViewTracker id={id} />
		</HydrationBoundary>
	);
};

export default PostDetailPage;
