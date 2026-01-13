import { MDXRemote } from "next-mdx-remote-client/rsc";
import { mdxComponents } from "@/components/mdx/mdx-components";
import type { Post } from "@/types/post";

type IPostDetailBody = Pick<Post, "content">;

const PostDetailBody = ({ content }: IPostDetailBody) => {
	return (
		<article className="prose dark:prose-invert max-w-none">
			<MDXRemote source={content} components={mdxComponents} />
		</article>
	);
};

export default PostDetailBody;
