"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { usePostsList } from "@/hooks/post/use-posts-list";
import { PLACEHOLDER_THUMBNAIL_PATH } from "@/lib/constant/image";
import { parseMarkdownToPlainText } from "@/lib/utils/markdown";
import { formatTimeAgo } from "@/lib/utils/time";

const PostsList = () => {
	const { observerRef, postsList, isFetchingNextPage } = usePostsList();

	return (
		<ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
			{postsList?.map((post) => (
				<li key={post.id}>
					<Link href={`/post/${post.slug}`}>
						<Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-border/40 h-full group">
							<article className="h-full flex flex-col">
								{/* Thumbnail Image */}
								<div className="relative aspect-video w-full overflow-hidden bg-muted">
									<Image
										src={post.thumbnail || PLACEHOLDER_THUMBNAIL_PATH}
										alt={post.title}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								</div>

								{/* Content */}
								<div className="p-5 md:p-6 flex flex-col flex-1">
									<div className="flex items-center gap-2 mb-3">
										<span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-md">
											{post.category?.title}
										</span>
									</div>

									<div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-3">
										<time dateTime={post.published_at ?? post.created_at}>
											{formatTimeAgo(post.published_at ?? post.created_at)}
										</time>
										<span>·</span>
										<span>조회 수 {post.view_count}</span>
									</div>

									<h2 className="text-xl md:text-2xl font-semibold mb-3 text-foreground text-balance group-hover:text-primary transition-colors line-clamp-1">
										{post.title}
									</h2>

									<p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 text-pretty line-clamp-2 flex-1">
										{parseMarkdownToPlainText(post.content)}
									</p>
								</div>
							</article>
						</Card>
					</Link>
				</li>
			))}
			{isFetchingNextPage && <Loader />}
			<div ref={observerRef} />
		</ul>
	);
};

export default PostsList;
