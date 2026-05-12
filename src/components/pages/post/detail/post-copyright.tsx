import type { Post } from "@/types/post";

type IPostCopyright = Pick<Post, "published_at" | "created_at">;

const PostCopyright = ({ published_at, created_at }: IPostCopyright) => {
	const baseDate = published_at ?? created_at;
	const year = baseDate
		? new Date(baseDate).getFullYear()
		: new Date().getFullYear();

	return (
		<aside className="mt-12 pt-6 border-t text-sm text-muted-foreground space-y-1">
			<p>
				<span aria-hidden="true">© </span>
				<span className="sr-only">Copyright </span>
				{year} 최성준. All rights reserved.
			</p>
			<p className="text-xs">
				본 글의 저작권은 작성자에게 있으며, 무단 복제 및 재배포를 금합니다.
			</p>
		</aside>
	);
};

export default PostCopyright;
