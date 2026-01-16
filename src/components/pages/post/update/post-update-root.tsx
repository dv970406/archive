"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetPostById } from "@/hooks/queries/post";
import {
  useSetCategory,
  useSetContent,
  useSetPostId,
  useSetThumbnail,
  useSetTitle,
} from "@/store/post/use-post-draft";
import PostWriteRoot from "../common/post-write-root";

const PostUpdateRoot = () => {
  // 수정할 post를 가져와서 편집할 수 있도록 store에 반영하는 코드
  const setPostId = useSetPostId();
  const setTitle = useSetTitle();
  const setContent = useSetContent();
  const setCategory = useSetCategory();
  const setThumbnail = useSetThumbnail();

  const { id } = useParams();
  const postId = parseInt(id as string) as number;
  const { data: post, isPending: isPostPending } = useGetPostById(postId);
  const { replace } = useRouter();

  useEffect(() => {
    if (isPostPending) return;
    if (!post) {
      replace(`/post/${id}`);
      return;
    }
    setPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setThumbnail(post.thumbnail);
  }, [
    id,
    isPostPending,
    post,
    replace,
    setCategory,
    setContent,
    setPostId,
    setThumbnail,
    setTitle,
  ]);

  return <PostWriteRoot type="UPDATE" />;
};
export default PostUpdateRoot;
