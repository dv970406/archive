"use client";

import { type HydrateProps, MDXClient } from "next-mdx-remote-client";
import { serialize } from "next-mdx-remote-client/serialize";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { MediaResizeContext } from "@/context/media-resize-context";

/** 입력이 멈춘 뒤 미리보기를 다시 컴파일하기까지의 지연(밀리초) */
const SERIALIZE_DEBOUNCE_MS = 500;

type CompiledMdx = Pick<
	HydrateProps,
	"compiledSource" | "frontmatter" | "scope"
>;

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

const compile = async (source: string): Promise<CompiledMdx | null> => {
	const result = await serialize({ source });
	return "compiledSource" in result ? result : null;
};

interface IMdxPreviewProps {
	content: string;
	onContentChange: (content: string) => void;
}

const MdxPreview = ({ content, onContentChange }: IMdxPreviewProps) => {
	const [mdxSource, setMdxSource] = useState<CompiledMdx | null>(null);
	const [hasError, setHasError] = useState(false);
	// 미디어 리사이즈로 바뀐 content 는 이미 컴파일했으므로 디바운스 재컴파일을 건너뛴다
	const skipNextCompileRef = useRef(false);
	const isFirstCompileRef = useRef(true);

	useEffect(() => {
		if (skipNextCompileRef.current) {
			skipNextCompileRef.current = false;
			return;
		}
		// 처음 열었을 때는 기다리지 않고 바로 그린다
		const delay = isFirstCompileRef.current ? 0 : SERIALIZE_DEBOUNCE_MS;
		isFirstCompileRef.current = false;

		let isCancelled = false;
		const timer = setTimeout(async () => {
			const compiled = await compile(content);
			if (isCancelled) return;
			setHasError(compiled === null);
			if (compiled) setMdxSource(compiled);
		}, delay);

		return () => {
			isCancelled = true;
			clearTimeout(timer);
		};
	}, [content]);

	const handleResize = useCallback(
		async (src: string, newWidth: number) => {
			const nextContent = updateMediaWidth(content, src, newWidth);
			if (nextContent === content) return;
			const compiled = await compile(nextContent);
			if (!compiled) return;
			skipNextCompileRef.current = true;
			onContentChange(nextContent);
			setMdxSource(compiled);
		},
		[content, onContentChange],
	);

	const contextValue = useMemo(
		() => ({ onResize: handleResize }),
		[handleResize],
	);

	return (
		<MediaResizeContext.Provider value={contextValue}>
			<div className="flex-1 flex flex-col min-w-0">
				<div className="px-6 py-3 border-b flex items-center justify-between">
					<h2 className="text-sm font-medium">미리보기</h2>
					{hasError && (
						<span className="text-sm text-destructive">
							MDX 문법 오류 — 컴포넌트 태그가 잘 닫혔는지 확인하세요
						</span>
					)}
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
		<span className="text-destructive font-semibold text-xl">
			문법이 뭔가 잘못되었음! 컴포넌트를 사용한 경우 태그가 잘닫혔는지 등 체크!
		</span>
	);
};

export default MdxPreview;
