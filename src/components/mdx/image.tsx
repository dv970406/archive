"use client";

import Image from "next/image";
import ResizableMediaWrapper from "./resizable-media-wrapper";

interface MdxImageProps {
	src: string;
	alt?: string;
	width?: number;
}

const MdxImage = ({ src, alt, width }: MdxImageProps) => {
	if (!src) return null;

	const imageElement = (
		<figure>
			<Image
				src={src}
				alt={alt || ""}
				width={0}
				height={0}
				sizes="100vw"
				className="w-full h-auto object-cover rounded-lg block"
			/>
			{alt && <figcaption className="text-center">{alt}</figcaption>}
		</figure>
	);

	if (width !== undefined) {
		return (
			<ResizableMediaWrapper src={src} width={width}>
				{imageElement}
			</ResizableMediaWrapper>
		);
	}

	return imageElement;
};

export default MdxImage;
