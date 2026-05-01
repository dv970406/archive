"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface VideoLightboxProps {
	src: string;
	alt?: string;
	onClose: () => void;
}

const VideoLightbox = ({ src, alt, onClose }: VideoLightboxProps) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		// 모달 열리는 동안 body 스크롤 방지
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [onClose]);

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-label={alt || "영상 확대 보기"}
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

			{/* 본문과 톤 통일: controls 없음, autoplay + loop + muted */}
			<video
				src={src}
				autoPlay
				loop
				muted
				playsInline
				onClick={(e) => e.stopPropagation()}
				className="max-w-[90vw] max-h-[95vh] object-contain rounded-lg"
			/>
		</div>,
		document.body,
	);
};

export default VideoLightbox;
