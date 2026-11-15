"use client";

import type { ReactNode } from "react";
import { useMediaResize } from "@/context/media-resize-context";
import ResizableMediaWrapper from "./resizable-media-wrapper";

interface MediaWidthWrapperProps {
	/** 리사이즈 시 MDX 소스에서 이 미디어를 찾는 기준 */
	src: string;
	/** 부모 너비 대비 퍼센트 */
	width: number;
	children: ReactNode;
}

/**
 * MDX 의 width={n} 값(%)대로 이미지·영상의 너비를 제한하고 가운데 정렬한다.
 * 에디터 미리보기(MediaResizeContext 가 있을 때)에서는 드래그로 너비를 조절할 수 있다
 */
const MediaWidthWrapper = ({
	src,
	width,
	children,
}: MediaWidthWrapperProps) => {
	const resizeContext = useMediaResize();

	if (resizeContext) {
		return (
			<ResizableMediaWrapper src={src} width={width}>
				{children}
			</ResizableMediaWrapper>
		);
	}

	return (
		<div style={{ width: `${width}%` }} className="relative block mx-auto">
			{children}
		</div>
	);
};

export default MediaWidthWrapper;
