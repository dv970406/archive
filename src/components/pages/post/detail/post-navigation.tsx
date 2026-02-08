import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { AdjacentPosts } from "@/types/post";

interface IPostNavigation {
	prev: AdjacentPosts | null;
	next: AdjacentPosts | null;
}

const PostNavigation = ({ next, prev }: IPostNavigation) => {
	return (
		<nav className="mt-12 pt-8 border-t grid grid-cols-2 gap-4">
			{prev ? (
				<Link
					href={`/post/${prev.slug}`}
					className="group flex flex-col gap-1 p-4 rounded-lg border hover:bg-muted transition-colors"
				>
					<span className="flex items-center gap-1 text-sm text-muted-foreground">
						<ChevronLeft className="w-4 h-4" />
						이전 글
					</span>
					<span className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
						{prev.title}
					</span>
				</Link>
			) : (
				<div />
			)}

			{next ? (
				<Link
					href={`/post/${next.slug}`}
					className="group flex flex-col gap-1 p-4 rounded-lg border hover:bg-muted transition-colors text-right"
				>
					<span className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
						다음 글
						<ChevronRight className="w-4 h-4" />
					</span>
					<span className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
						{next.title}
					</span>
				</Link>
			) : (
				<div />
			)}
		</nav>
	);
};

export default PostNavigation;
