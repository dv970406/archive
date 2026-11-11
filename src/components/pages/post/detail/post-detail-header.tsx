import Image from "next/image";
import TimeAgo from "@/components/ui/time-ago";
import { PLACEHOLDER_THUMBNAIL_PATH } from "@/lib/constant/image";
import { formatTimeAgo } from "@/lib/utils/time";
import type { Post } from "@/types/post";

type IPostDetailHeader = Pick<
	Post,
	"category" | "title" | "publishedAt" | "thumbnail"
>;
const PostDetailHeader = ({
	category,
	title,
	publishedAt,
	thumbnail,
}: IPostDetailHeader) => {
	return (
		<header className="mb-10 pb-8 border-b">
			<h2 className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md w-fit mb-4">
				{category.title}
			</h2>

			<h1 className="text-4xl font-bold mb-6">{title}</h1>

			<div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
				<TimeAgo
					dateTime={publishedAt}
					initialLabel={formatTimeAgo(publishedAt)}
				/>
			</div>

			<div className="relative w-full aspect-video md:aspect-21/9 overflow-hidden rounded-lg bg-muted mb-6">
				<Image
					src={thumbnail || PLACEHOLDER_THUMBNAIL_PATH}
					alt={title}
					fill
					className="object-cover"
				/>
			</div>
		</header>
	);
};

export default PostDetailHeader;
