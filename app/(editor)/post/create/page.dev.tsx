import type { Metadata } from "next";
import PostEditorRoot from "@/components/pages/editor/post-editor-root";
import { getAllCategories } from "@/lib/content/categories";
import { listDrafts } from "@/lib/content/post-files";

/**
 * 개발 서버 전용 새 글 작성 화면.
 * 파일명이 `page.dev.tsx` 라서 `next.config.ts` 가 개발 단계에서만 추가하는 `dev.tsx` 확장자로만 인식되며,
 * 프로덕션 빌드에는 포함되지 않는다 (배포 결과는 정적 사이트라 파일을 쓸 수 없다).
 * 제목·경로·카테고리를 입력하면 content/drafts/<slug>.mdx 로 자동 저장된다.
 */

export const metadata: Metadata = {
	title: "글 작성",
};

const PostCreatePage = () => {
	const categories = getAllCategories();

	return (
		<PostEditorRoot
			initialDraft={{
				slug: "",
				title: "",
				category: categories[0]?.pathname ?? "",
				thumbnail: null,
				content: "",
			}}
			initialLocation={null}
			categories={categories}
			drafts={listDrafts()}
		/>
	);
};

export default PostCreatePage;
