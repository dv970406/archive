import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostEditorRoot from "@/components/pages/editor/post-editor-root";
import { getAllCategories } from "@/lib/content/categories";
import {
	findPostLocation,
	getPostFilePath,
	readPostFile,
} from "@/lib/content/post-files";

/**
 * 개발 서버 전용 글 수정 화면 (공개 글·초안 공통).
 * `page.dev.tsx` 라서 프로덕션 빌드에는 포함되지 않는다.
 */

export const metadata: Metadata = {
	title: "글 수정",
};

interface IPostUpdatePageProps {
	params: Promise<{ slug: string }>;
}

const PostUpdatePage = async ({ params }: IPostUpdatePageProps) => {
	const { slug } = await params;

	const location = findPostLocation(slug);
	if (!location) notFound();

	const { data, content } = readPostFile(getPostFilePath(location, slug));
	const categories = getAllCategories();

	return (
		<PostEditorRoot
			initialDraft={{
				slug,
				title: typeof data.title === "string" ? data.title : "",
				category:
					typeof data.category === "string"
						? data.category
						: (categories[0]?.pathname ?? ""),
				thumbnail:
					typeof data.thumbnail === "string" && data.thumbnail !== ""
						? data.thumbnail
						: null,
				content,
			}}
			initialLocation={location}
			categories={categories}
		/>
	);
};

export default PostUpdatePage;
