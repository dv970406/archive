"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ImageLightboxProps {
	src: string;
	alt?: string;
	// gallery 모드일 때만 전달
	onPrev?: () => void;
	onNext?: () => void;
	hasPrev?: boolean;
	hasNext?: boolean;
	onClose: () => void;
}

const ImageLightbox = ({
	src,
	alt,
	onPrev,
	onNext,
	hasPrev,
	hasNext,
	onClose,
}: ImageLightboxProps) => {
	const isGalleryMode = onPrev !== undefined && onNext !== undefined;

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
			if (isGalleryMode) {
				if (e.key === "ArrowLeft" && hasPrev) onPrev();
				if (e.key === "ArrowRight" && hasNext) onNext();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		// 모달 열리는 동안 body 스크롤 방지
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [onClose, onPrev, onNext, hasPrev, hasNext, isGalleryMode]);

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-label={alt || "이미지 확대 보기"}
			className="fixed z-100 inset-0 flex items-center justify-center w-full h-full bg-black/85 backdrop-blur-sm"
		>
			{/* 닫기 버튼 */}
			<button
				type="button"
				aria-label="닫기"
				onClick={onClose}
				className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
			>
				<X size={20} />
			</button>

			{/* 이전 버튼 */}
			{isGalleryMode && (
				<button
					type="button"
					aria-label="이전 이미지"
					onClick={onPrev}
					disabled={!hasPrev}
					className="absolute z-10 left-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
				>
					<ChevronLeft size={24} />
				</button>
			)}

			<Image
				src={src}
				alt={alt || ""}
				width={0}
				height={0}
				sizes="100vw"
				className="w-full h-full max-w-[90vw] max-h-[95vh] object-contain rounded-lg"
			/>

			{/* 다음 버튼 */}
			{isGalleryMode && (
				<button
					type="button"
					aria-label="다음 이미지"
					onClick={onNext}
					disabled={!hasNext}
					className="absolute z-10 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
				>
					<ChevronRight size={24} />
				</button>
			)}
		</div>,
		document.body,
	);
};

export default ImageLightbox;
