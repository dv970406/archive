import { type HydrateProps, MDXClient } from "next-mdx-remote-client";
import { serialize } from "next-mdx-remote-client/serialize";
import { useEffect, useState } from "react";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { usePostDraft } from "@/store/post/use-post-draft";

const MdxPreview = () => {
	const { content } = usePostDraft();
	const [mdxSource, setMdxSource] = useState<Pick<
		HydrateProps,
		"compiledSource" | "frontmatter" | "scope"
	> | null>(null);

	useEffect(() => {
		if (!content) return;

		const debounce = setTimeout(async () => {
			const result = await serialize({
				source: content,
			});

			// compiledSource가 있는 경우에만 state 업데이트
			if ("compiledSource" in result) {
				setMdxSource(result);
			}
		}, 1000); // 1000ms 디바운스

		return () => clearTimeout(debounce);
	}, [content]);

	return (
		<div className={`flex-1 flex flex-col`}>
			<div className="px-6 py-3 border-b">
				<h2>미리보기</h2>
			</div>

			<div className="prose dark:prose-invert max-w-none p-6 overflow-auto scrollbar-hidden break-all">
				{mdxSource && (
					<MDXClient
						{...mdxSource}
						components={mdxComponents}
						onError={ErrorComponent}
					/>
				)}
			</div>
		</div>
	);
};

const ErrorComponent = () => {
	return (
		<span className="text-red-500 font-semibold text-xl">
			문법이 뭔가 잘못되었음! 컴포넌트를 사용한 경우 태그가 잘닫혔는지 등 체크!
		</span>
	);
};

export default MdxPreview;
