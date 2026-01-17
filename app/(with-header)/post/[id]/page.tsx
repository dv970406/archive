import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Giscus from "@/components/pages/post/detail/giscus";
import PostDetailBody from "@/components/pages/post/detail/post-detail-body";
import PostDetailHeader from "@/components/pages/post/detail/post-detail-header";
import ViewTracker from "@/components/pages/post/detail/view-tracker";
import { getPostByIdQuery } from "@/hooks/queries/post";
import { getQueryClient } from "@/lib/utils/tanstack-query";

interface IPostDetailPage {
	params: Promise<{ id: string }>;
}
const PostPage = async ({ params }: IPostDetailPage) => {
	const { id } = await params;
	const queryClient = getQueryClient();

	const parsedPostId = Number.parseInt(id);

	// 헤더, 바디 컴포넌트를 서버 컴포넌트로만 구현하기 위해 useQuery를 사용하지 않음
	const postData = await queryClient.fetchQuery(getPostByIdQuery(parsedPostId));

	if (!postData) return null;

	const {
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
			<ViewTracker id={parsedPostId} />
		</HydrationBoundary>
	);
};

export default PostPage;
