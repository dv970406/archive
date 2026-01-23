"use client";

import { Button } from "@/components/ui/button";
import { usePostEditorTabs } from "@/hooks/post/use-post-editor-tabs";
import { usePublishPost } from "@/hooks/post/use-publish-post";
import { cn } from "@/lib/style/tailwind";
import EditorController from "./editor-controller";
import MdxPreview from "./mdx-preview";
import PostEditor from "./post-editor";
import TipsForMdx from "./tips-for-mdx";

interface IPostWriteRoot {
	type: "CREATE" | "UPDATE";
}
const PostWriteRoot = ({ type }: IPostWriteRoot) => {
	const { handleActiveTab, isPreviewTab, isSplitTab, isWriteTab } =
		usePostEditorTabs();

	const { handlePublishPost, isPublishPostPending } = usePublishPost({
		type,
	});

	return (
		<div className="flex flex-col h-screen">
			{/* 헤더 */}
			<div className="border-b px-6 py-4">
				<div className="flex items-center justify-between">
					<h1>MDX 에디터</h1>

					<div className="flex items-center gap-4">
						<EditorController
							isPreviewTab={isPreviewTab}
							isWriteTab={isWriteTab}
							isSplitTab={isSplitTab}
							handleActiveTab={handleActiveTab}
						/>
						<Button
							type="button"
							onClick={handlePublishPost}
							disabled={isPublishPostPending}
							className="px-4 py-2"
						>
							저장
						</Button>
					</div>
				</div>
			</div>

			{/* 에디터 영역 */}
			<div
				className={cn("h-full flex overflow-hidden", {
					"divide-x divide-gray-200 dark:divide-gray-700": isSplitTab,
				})}
			>
				{/* 작성 패널 */}
				{!isPreviewTab && (
					<PostEditor isPublishPostPending={isPublishPostPending} />
				)}

				{/* 미리보기 패널 */}
				{!isWriteTab && <MdxPreview />}
			</div>

			{/* 하단 도움말 */}
			<TipsForMdx />
		</div>
	);
};

export default PostWriteRoot;
