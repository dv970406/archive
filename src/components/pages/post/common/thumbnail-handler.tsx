import { XIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
	type IUseThumbnailHandler,
	useThumbnailHandler,
} from "@/hooks/post/use-thumbnail-handler";

type IThumbnailHandler = IUseThumbnailHandler;
const ThumbnailHandler = ({ postId }: IThumbnailHandler) => {
	const {
		handleDeleteThumbnail,
		handleSelectThumbnail,
		handleUploadThumbnail,
		inputRef,
		isUploadImagePending,
		thumbnail,
	} = useThumbnailHandler({
		postId,
	});

	if (thumbnail) {
		return (
			<div className="flex gap-1.5 items-center">
				<Link href={thumbnail} target="_blank" className="text-primary">
					미리보기
				</Link>

				<button type="button" onClick={handleDeleteThumbnail}>
					<XIcon className="w-4 h-4 text-white" />
				</button>
			</div>
		);
	}

	return (
		<>
			<input
				type="file"
				className="hidden"
				ref={inputRef}
				accept="image/*"
				onChange={handleUploadThumbnail}
				disabled={isUploadImagePending}
			/>
			<Button onClick={handleSelectThumbnail} disabled={isUploadImagePending}>
				썸네일 업로드
			</Button>
		</>
	);
};

export default ThumbnailHandler;
