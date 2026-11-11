"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import TimeAgo from "@/components/ui/time-ago";
import { useInfiniteScrollTrigger } from "@/hooks/common/use-infinite-scroll-trigger";
import { PLACEHOLDER_THUMBNAIL_PATH } from "@/lib/constant/image";
import type { PostCard } from "@/types/post";

/** 한 번에 추가로 노출하는 카드 수 */
const PAGE_SIZE = 10;

/**
 * 경로별로 펼쳐 둔 카드 수를 기억하는 메모리 캐시.
 * 상세 글로 들어갔다가 뒤로 돌아와도 스크롤해 둔 카드가 그대로 복원되게 한다 (기존 쿼리 캐시 유지 UX 와 동일).
 * 서버와 첫 하이드레이션 시점에는 비어 있어 항상 PAGE_SIZE 로 시작하므로 하이드레이션 불일치가 없다.
 */
const visibleCountByPathname = new Map<string, number>();

interface IPostsListProps {
	posts: PostCard[];
}

const PostsList = ({ posts }: IPostsListProps) => {
	// 전체 목록은 빌드 시점에 props 로 받고, 화면에는 PAGE_SIZE 개씩 점진적으로 노출한다 (무한 스크롤 UX 유지)
	const pathname = usePathname();
	const [visibleCount, setVisibleCount] = useState(
		() => visibleCountByPathname.get(pathname) ?? PAGE_SIZE,
	);
	const visiblePosts = posts.slice(0, visibleCount);
	const hasNextPage = visibleCount < posts.length;

	const { observerRef } = useInfiniteScrollTrigger({
		hasNextPage,
		// 의도적으로 매 렌더마다 새 함수를 넘겨 노출 개수가 바뀔 때마다 감시를 다시 건다.
		// 감시 요소가 계속 뷰포트 안에 남아 있어도 다음 묶음이 이어서 노출되게 하기 위함.
		onLoadMore: () => setVisibleCount((count) => count + PAGE_SIZE),
	});

	useEffect(() => {
		visibleCountByPathname.set(pathname, visibleCount);
	}, [pathname, visibleCount]);

	return (
		<ul className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
			{visiblePosts.map((post) => (
				<li key={post.slug}>
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
											{post.categoryTitle}
										</span>
									</div>

									<div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-3">
										<TimeAgo
											dateTime={post.publishedAt}
											initialLabel={post.publishedAtLabel}
										/>
									</div>

									<h2 className="text-xl md:text-2xl font-semibold mb-3 text-foreground text-balance group-hover:text-primary transition-colors line-clamp-1">
										{post.title}
									</h2>

									<p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 text-pretty line-clamp-2 flex-1">
										{post.excerpt}
									</p>
								</div>
							</article>
						</Card>
					</Link>
				</li>
			))}
			<div ref={observerRef} />
		</ul>
	);
};

export default PostsList;
