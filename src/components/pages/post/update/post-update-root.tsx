"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetPostBySlug } from "@/hooks/queries/post";
import { useSetDraft } from "@/store/post/use-post-draft";
import PostWriteRoot from "../common/post-write-root";

const PostUpdateRoot = () => {
	// 수정할 post를 가져와서 편집할 수 있도록 store에 반영하는 코드
	const setDraft = useSetDraft();

	const { slug } = useParams();
	const { data: post, isPending: isPostPending } = useGetPostBySlug(
		slug as string,
	);
	const { replace } = useRouter();

	useEffect(() => {
		if (isPostPending) return;
		if (!post) {
			replace(`/post/${slug}`);
			return;
		}
		setDraft({
			id: post.id,
			title: post.title,
			content: post.content,
			category: post.category,
			thumbnail: post.thumbnail,
			slug: post.slug,
		});
	}, [slug, isPostPending, post, replace, setDraft]);

	return <PostWriteRoot type="UPDATE" />;
};
export default PostUpdateRoot;
