"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Loader from "@/components/ui/loader";
import { useGetPostBySlug } from "@/hooks/queries/post";
import { usePostDraftField, useSetDraft } from "@/store/post/use-post-draft";
import PostWriteRoot from "../common/post-write-root";

const PostUpdateRoot = () => {
	// 수정할 post를 가져와서 편집할 수 있도록 store에 반영하는 코드
	const setDraft = useSetDraft();
	const draftId = usePostDraftField("id");

	const { slug } = useParams();
	const currentSlug = slug as string;

	const { data: post, isPending: isPostPending } =
		useGetPostBySlug(currentSlug);
	const { replace } = useRouter();

	// 이미 store에 주입한 글의 slug. 같은 글은 다시 주입하지 않는다.
	// 쿼리 캐시가 갱신되면 post의 객체 identity가 바뀌어 effect가 재실행되는데,
	// 그때 setDraft가 작성 중이던 제목/본문을 서버 저장본으로 덮어쓰기 때문.
	const loadedSlugRef = useRef<string | null>(null);

	useEffect(() => {
		if (isPostPending) return;
		if (!post) {
			replace(`/post/${currentSlug}`);
			return;
		}
		// 주입 조건과 아래 렌더 게이트 조건을 일치시켜야 한다.
		// 어긋나면 store가 다른 글로 채워진 채 ref만 남아 Loader에서 못 빠져나온다.
		if (loadedSlugRef.current === post.slug && draftId === post.id) return;

		loadedSlugRef.current = post.slug;
		setDraft({
			id: post.id,
			title: post.title,
			content: post.content,
			category: post.category,
			thumbnail: post.thumbnail,
			slug: post.slug,
			status: post.status,
		});
	}, [currentSlug, isPostPending, post, replace, setDraft, draftId]);

	// store가 이 글로 채워지기 전에는 에디터를 띄우지 않는다.
	// 그렇지 않으면 로딩 구간에 직전 글의 id/status가 store에 남아 있어
	// 저장·숨기기 버튼이 엉뚱한 글에 적용된다.
	// id는 에디터에서 수정되지 않는 필드라 판별 기준으로 안전하다.
	const isDraftReady =
		!!post && post.slug === currentSlug && draftId === post.id;

	if (!isDraftReady) return <Loader />;

	return <PostWriteRoot type="UPDATE" />;
};
export default PostUpdateRoot;
