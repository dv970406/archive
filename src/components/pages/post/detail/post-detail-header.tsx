import Image from "next/image";
import { formatTimeAgo } from "@/lib/utils/time";
import type { Post } from "@/types/post";

type IPostDetailHeader = Pick<
  Post,
  | "category"
  | "title"
  | "created_at"
  | "view_count"
  | "published_at"
  | "thumbnail"
>;
const PostDetailHeader = ({
  category,
  created_at,
  title,
  view_count,
  published_at,
  thumbnail,
}: IPostDetailHeader) => {
  return (
    <header className="mb-10 pb-8 border-b">
      {category && (
        <h2 className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md w-fit mb-4">
          {category.title}
        </h2>
      )}

      <h1 className="text-4xl font-bold mb-6">{title}</h1>

      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
        <time dateTime={published_at ?? created_at}>
          {formatTimeAgo(published_at ?? created_at)}
        </time>
        <span>·</span>
        <span>조회 수 {view_count}</span>
      </div>

      <div className="relative w-full aspect-video md:aspect-21/9 overflow-hidden rounded-lg bg-muted mb-6">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
    </header>
  );
};

export default PostDetailHeader;
