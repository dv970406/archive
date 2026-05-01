"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ResizableMediaWrapper from "./resizable-media-wrapper";
import VideoLightbox from "./video-lightbox";

interface MdxVideoProps {
	src: string;
	alt?: string;
	width?: number;
}

// 전역 비디오 캐시 — MDXClient 재컴파일 시 <video> DOM 요소를 보존하여 깜빡임 방지
const videoCache = new Map<string, HTMLVideoElement>();

const MdxVideo = ({ src, alt, width }: MdxVideoProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);

	// useLayoutEffect: DOM 커밋 직후, 브라우저 페인트 전에 실행
	// → 비디오가 빠진 상태로 화면이 그려지지 않아 깜빡임/스크롤 리셋 방지
	useLayoutEffect(() => {
		if (!src || !containerRef.current) return;

		// 캐시에서 기존 비디오 요소 재사용 또는 새로 생성
		let video = videoCache.get(src);
		if (!video) {
			video = document.createElement("video");
			video.src = src;
			video.loop = true;
			video.muted = true;
			video.playsInline = true;
			video.preload = "metadata";
			video.className = "w-full rounded-lg cursor-zoom-in";
			videoCache.set(src, video);
		}

		containerRef.current.appendChild(video);
		videoRef.current = video;

		const handleClick = () => setIsLightboxOpen(true);
		video.addEventListener("click", handleClick);

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					video.play().catch(() => {});
				} else {
					video.pause();
				}
			},
			{ threshold: 0.03 },
		);

		observer.observe(video);

		return () => {
			observer.disconnect();
			video.removeEventListener("click", handleClick);
			// DOM에서 분리만 하고 캐시에는 보존 → 재마운트 시 같은 요소 재사용
			video.parentElement?.removeChild(video);
			videoRef.current = null;
		};
	}, [src]);

	// 라이트박스 오픈/닫기에 따라 본문 영상 재생 제어
	// → 라이트박스 영상과 동시 디코딩으로 인한 CPU/GPU 자원 낭비 방지
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		if (isLightboxOpen) {
			video.pause();
		} else {
			video.play().catch(() => {});
		}
	}, [isLightboxOpen]);

	if (!src) return null;

	const videoElement = (
		<figure>
			<div ref={containerRef} />
			{alt && <figcaption className="text-center">{alt}</figcaption>}
		</figure>
	);

	return (
		<>
			{width !== undefined ? (
				<ResizableMediaWrapper src={src} width={width}>
					{videoElement}
				</ResizableMediaWrapper>
			) : (
				videoElement
			)}
			{isLightboxOpen && (
				<VideoLightbox
					src={src}
					alt={alt}
					onClose={() => setIsLightboxOpen(false)}
				/>
			)}
		</>
	);
};

export default MdxVideo;
