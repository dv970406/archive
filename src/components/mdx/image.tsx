"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import ResizableMediaWrapper from "./resizable-media-wrapper";

const ImageLightbox = dynamic(() => import("./image-lightbox"));

interface MdxImageProps {
	src: string;
	alt?: string;
	width?: number;
	// gallery에서 외부 라이트박스를 주입할 때 사용 (자체 라이트박스 비활성화)
	onClick?: () => void;
}

const MdxImage = ({ src, alt, width, onClick }: MdxImageProps) => {
	// hooks는 early return 전에 항상 호출되어야 함
	const [lightboxOpen, setLightboxOpen] = useState(false);

	if (!src) return null;

	const handleClick = onClick ?? (() => setLightboxOpen(true));

	const imageElement = (
		<figure>
			<button
				type="button"
				aria-label={`${alt || "이미지"} 확대 보기`}
				className="cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
				onClick={handleClick}
			>
				<Image
					src={src}
					alt={alt || ""}
					width={0}
					height={0}
					sizes="100vw"
					className="w-full h-auto object-cover rounded-lg not-prose"
				/>
			</button>
			{alt && (
				<figcaption className="text-center font-bold mt-1">{alt}</figcaption>
			)}
		</figure>
	);

	const content =
		width !== undefined ? (
			<ResizableMediaWrapper src={src} width={width}>
				{imageElement}
			</ResizableMediaWrapper>
		) : (
			imageElement
		);

	return (
		<>
			{content}
			{/* 외부 onClick이 없을 때만 자체 라이트박스 렌더 */}
			{!onClick && lightboxOpen && (
				<ImageLightbox
					src={src}
					alt={alt}
					onClose={() => setLightboxOpen(false)}
				/>
			)}
		</>
	);
};

export default MdxImage;
