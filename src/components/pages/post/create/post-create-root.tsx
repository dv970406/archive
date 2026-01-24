"use client";

import { useSavedPostDraft } from "@/hooks/post/use-saved-post-draft";
import PostWriteRoot from "../common/post-write-root";

const PostCreateRoot = () => {
	useSavedPostDraft(); // create에서만 호출
	return <PostWriteRoot type="CREATE" />;
};
export default PostCreateRoot;
