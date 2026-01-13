import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useDropdownImage } from "@/hooks/post/use-dropdown-image";
import type { IUsePublishPostReturn } from "@/hooks/post/use-publish-post";
import {
	usePostDraft,
	useSetCategory,
	useSetContent,
	useSetThumbnail,
	useSetTitle,
} from "@/store/post/use-post-draft";
import type { Post } from "@/types/post";
import CategoryDropdown from "./category-dropdown";
import ThumbnailUploader from "./thumbnail-uploader";

type IPostCreateEditorProps = Pick<
	IUsePublishPostReturn,
	"isPublishPostPending"
>;

const PostCreateEditor = ({ isPublishPostPending }: IPostCreateEditorProps) => {
	const setTitle = useSetTitle();
	const setContent = useSetContent();
	const setCategory = useSetCategory();
	const setThumbnail = useSetThumbnail();

	const { category, content, title, thumbnail, id } = usePostDraft();
	const { handleDragOver, handleDrop, textareaRef } = useDropdownImage({
		postId: id,
		content,
		setContent,
	});

	const handleSetCategory = useCallback(
		(category: Post["category"]) => () => {
			setCategory(category);
		},
		[setCategory],
	);

	const handleSetThumbnail = useCallback(
		(thumbnail: Post["thumbnail"]) => {
			setThumbnail(thumbnail);
		},
		[setThumbnail],
	);
	return (
		<div className={"flex-1 flex flex-col"}>
			<div className="px-6 py-3 border-b flex gap-4">
				<Input
					value={title}
					onChange={(event) => setTitle(event.currentTarget.value)}
					className="w-100"
					placeholder="제목을 입력해주세요."
				/>

				<CategoryDropdown
					selectedCategory={category}
					onClick={handleSetCategory}
				/>

				<ThumbnailUploader
					onChange={handleSetThumbnail}
					selectedThumbnail={thumbnail}
					postId={id}
				/>
			</div>

			<textarea
				disabled={isPublishPostPending}
				ref={textareaRef}
				value={content}
				onChange={(event) => setContent(event.currentTarget.value)}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				className="w-full p-6 h-full resize-none outline-none disabled:bg-muted-foreground"
				placeholder="여기에 MDX를 작성하세요... (이미지를 드래그해서 업로드)"
			/>
		</div>
	);
};

export default PostCreateEditor;
