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
			className="fixed inset-0 z-50 flex items-center justify-center"
		>
			{/* 백드롭 — 클릭 시 닫기 (button으로 접근성 확보) */}
			<button
				type="button"
				aria-label="닫기"
				className="absolute inset-0 w-full h-full bg-black/85 backdrop-blur-sm cursor-default"
				onClick={onClose}
			/>

			{/* 닫기 버튼 */}
			<button
				type="button"
				aria-label="닫기"
				onClick={onClose}
				className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
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
					className="absolute left-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
				>
					<ChevronLeft size={24} />
				</button>
			)}

			{/* 이미지 — z-10으로 백드롭 위에 표시 */}
			<div className="relative z-10 max-w-[80vw] max-h-[90vh] pointer-events-none">
				<Image
					src={src}
					alt={alt || ""}
					width={0}
					height={0}
					sizes="80vw"
					className="w-auto h-auto max-w-[80vw] max-h-[85vh] object-contain rounded-lg"
				/>
				{alt && <p className="mt-2 text-center text-sm text-white/70">{alt}</p>}
			</div>

			{/* 다음 버튼 */}
			{isGalleryMode && (
				<button
					type="button"
					aria-label="다음 이미지"
					onClick={onNext}
					disabled={!hasNext}
					className="absolute right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
				>
					<ChevronRight size={24} />
				</button>
			)}
		</div>,
		document.body,
	);
};

export default ImageLightbox;
