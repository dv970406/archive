"use client";

import dynamic from "next/dynamic";
import {
	Children,
	isValidElement,
	type ReactNode,
	useCallback,
	useMemo,
	useState,
} from "react";
import { cn } from "@/lib/style/tailwind";
import MdxImage from "./image";

const ImageLightbox = dynamic(() => import("./image-lightbox"));

interface MdxImageElement {
	src: string;
	alt?: string;
}

/** src 속성을 가진 유효한 React 엘리먼트인지 검사하는 타입 가드 */
const isMdxImageElement = (
	child: ReactNode,
): child is React.ReactElement<{ src: string; alt?: string }> =>
	isValidElement(child) &&
	typeof child.props === "object" &&
	child.props !== null &&
	"src" in child.props;

interface ImageGalleryClientProps {
	children: ReactNode;
}

/** children에서 MdxImage props(src, alt)를 추출 */
const extractImageData = (children: ReactNode): MdxImageElement[] => {
	return Children.toArray(children)
		.filter(isMdxImageElement)
		.map((child) => {
			const { src, alt } = child.props;
			return { src, alt };
		});
};

const ImageGalleryClient = ({ children }: ImageGalleryClientProps) => {
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
	const images = useMemo(() => extractImageData(children), [children]);
	const childCount = Children.count(children);
	const isScrollable = childCount > 2;

	const handleClose = useCallback(() => setLightboxIndex(null), []);
	const handlePrev = useCallback(
		() => setLightboxIndex((i) => (i !== null ? Math.max(0, i - 1) : null)),
		[],
	);
	const handleNext = useCallback(
		() =>
			setLightboxIndex((i) =>
				i !== null ? Math.min(images.length - 1, i + 1) : null,
			),
		[images.length],
	);

	// 각 MdxImage에 onClick을 주입 — 이미지 전용 인덱스를 사용해 images 배열과 동기화
	let imageIndex = 0;
	const enhancedChildren = Children.map(children, (child) => {
		if (isMdxImageElement(child)) {
			const currentIndex = imageIndex++;
			const props = (
				child as React.ReactElement<{
					src: string;
					alt?: string;
					width?: number;
				}>
			).props;
			return (
				<MdxImage
					key={props.src}
					{...props}
					onClick={() => setLightboxIndex(currentIndex)}
				/>
			);
		}
		return child;
	});

	return (
		<>
			<div
				className={cn("gap-4 my-6 pb-2 w-full", {
					"grid grid-cols-2": !isScrollable,
					"flex [&>figure]:w-1/2 overflow-x-scroll [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-track]:bg-muted":
						isScrollable,
				})}
			>
				{enhancedChildren}
			</div>

			{lightboxIndex !== null && images[lightboxIndex] && (
				<ImageLightbox
					src={images[lightboxIndex].src}
					alt={images[lightboxIndex].alt}
					onClose={handleClose}
					onPrev={handlePrev}
					onNext={handleNext}
					hasPrev={lightboxIndex > 0}
					hasNext={lightboxIndex < images.length - 1}
				/>
			)}
		</>
	);
};

export default ImageGalleryClient;
