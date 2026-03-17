"use client";

import { type HydrateProps, MDXClient } from "next-mdx-remote-client";
import { serialize } from "next-mdx-remote-client/serialize";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { MediaResizeContext } from "@/context/media-resize-context";
import {
	getContent,
	subscribeContent,
	useSetContent,
} from "@/store/post/use-post-draft";

// src URL을 기준으로 MDX 소스의 width={N} 값을 교체
// [^>]* 는 > 제외 모든 문자(\n 포함) 매칭 → 멀티라인 태그 대응
const updateMediaWidth = (
	content: string,
	src: string,
	newWidth: number,
): string => {
	const escapedSrc = src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const regex = new RegExp(
		`(<(?:Image|Video)[^>]*src="${escapedSrc}"[^>]*?)\\s*width=\\{\\d+\\}`,
		"g",
	);
	return content.replace(regex, `$1 width={${newWidth}}`);
};

const MdxPreview = () => {
	const setContent = useSetContent();
	const [mdxSource, setMdxSource] = useState<Pick<
		HydrateProps,
		"compiledSource" | "frontmatter" | "scope"
	> | null>(null);

	// resize로 인한 content 변경 시 MDX 재컴파일 건너뜀
	const skipSerializeRef = useRef(false);

	// content 변경을 subscribe로 감지 → 렌더 없이 디바운스 후에만 mdxSource 업데이트
	useEffect(() => {
		// 마운트 시 현재 content로 초기 serialize
		const initialContent = getContent();
		if (initialContent) {
			serialize({ source: initialContent }).then((result) => {
				if ("compiledSource" in result) {
					setMdxSource(result);
				}
			});
		}

		let debounceTimer: ReturnType<typeof setTimeout>;

		const unsubscribe = subscribeContent((content) => {
			// 항상 이전 타이머를 취소 (skip 시에도 이전 타이머가 stale content로 발동하는 것 방지)
			clearTimeout(debounceTimer);
			if (!content) return;
			if (skipSerializeRef.current) {
				skipSerializeRef.current = false;
				return;
			}

			debounceTimer = setTimeout(async () => {
				const result = await serialize({ source: content });
				if ("compiledSource" in result) {
					setMdxSource(result);
				}
			}, 1000);
		});

		return () => {
			unsubscribe();
			clearTimeout(debounceTimer);
		};
	}, []);

	const handleResize = useCallback(
		async (src: string, newWidth: number) => {
			const currentContent = getContent();
			const newContent = updateMediaWidth(currentContent, src, newWidth);
			skipSerializeRef.current = true;
			const result = await serialize({ source: newContent });
			if ("compiledSource" in result) {
				setContent(newContent);
				setMdxSource(result);
			}
		},
		[setContent],
	);

	const contextValue = useMemo(
		() => ({ onResize: handleResize }),
		[handleResize],
	);

	return (
		<MediaResizeContext.Provider value={contextValue}>
			<div className="flex-1 flex flex-col">
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
		</MediaResizeContext.Provider>
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
