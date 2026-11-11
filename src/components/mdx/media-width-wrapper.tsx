import type { ReactNode } from "react";

interface MediaWidthWrapperProps {
	/** 부모 너비 대비 퍼센트 */
	width: number;
	children: ReactNode;
}

/** MDX 의 width={n} 값(%)대로 이미지·영상의 너비를 제한하고 가운데 정렬한다 */
const MediaWidthWrapper = ({ width, children }: MediaWidthWrapperProps) => {
	return (
		<div style={{ width: `${width}%` }} className="relative block mx-auto">
			{children}
		</div>
	);
};

export default MediaWidthWrapper;
