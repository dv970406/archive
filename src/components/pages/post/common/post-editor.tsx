import { Input } from "@/components/ui/input";
import { useImageUploader } from "@/hooks/post/use-image-uploader";
import type { IUsePublishPostReturn } from "@/hooks/post/use-publish-post";
import {
	usePostDraft,
	useSetContent,
	useSetSlug,
	useSetTitle,
} from "@/store/post/use-post-draft";
import CategoryDropdown from "./category-dropdown";
import ThumbnailHandler from "./thumbnail-handler";

type IPostEditorProps = Pick<IUsePublishPostReturn, "isPending">;

const PostEditor = ({ isPending }: IPostEditorProps) => {
	const setTitle = useSetTitle();
	const setContent = useSetContent();
	const setSlug = useSetSlug();

	const { content, title, id, slug } = usePostDraft();
	const { handleDragOver, handleDrop, handlePaste, textareaRef } =
		useImageUploader({
			postId: id,
			content,
			setContent,
		});

	return (
		<div className={"flex-1 flex flex-col"}>
			<div className="px-6 py-3 border-b flex flex-col gap-4">
				<div className="flex gap-2">
					<Input
						value={title}
						onChange={(event) => setTitle(event.currentTarget.value)}
						className="w-full"
						placeholder="제목을 입력해주세요."
					/>
					<Input
						value={slug}
						onChange={(event) => setSlug(event.currentTarget.value)}
						className="w-full"
						placeholder="경로를 입력해주세요."
					/>
				</div>

				<div className="flex gap-2">
					<CategoryDropdown />
					<ThumbnailHandler postId={id} />
				</div>
			</div>

			<textarea
				disabled={isPending}
				ref={textareaRef}
				value={content}
				onChange={(event) => setContent(event.currentTarget.value)}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				onPaste={handlePaste}
				className="w-full p-6 h-full resize-none outline-none disabled:bg-muted-foreground"
				placeholder="여기에 MDX를 작성하세요... (이미지를 드래그해서 업로드 또는 붙여넣기)"
			/>
		</div>
	);
};

export default PostEditor;
