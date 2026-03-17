"use client";

import { useLayoutEffect, useRef } from "react";
import ResizableMediaWrapper from "./resizable-media-wrapper";

interface MdxVideoProps {
	src: string;
	alt?: string;
	width?: number;
}

// 전역 비디오 캐시 — MDXClient 재컴파일 시 <video> DOM 요소를 보존하여 깜빡임 방지
const videoCache = new Map<string, HTMLVideoElement>();

const MdxVideo = ({ src, alt, width }: MdxVideoProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

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
			video.className = "w-full rounded-lg";
			videoCache.set(src, video);
		}

		containerRef.current.appendChild(video);

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
			// DOM에서 분리만 하고 캐시에는 보존 → 재마운트 시 같은 요소 재사용
			video.parentElement?.removeChild(video);
		};
	}, [src]);

	if (!src) return null;

	const videoElement = (
		<figure>
			<div ref={containerRef} />
			{alt && <figcaption className="text-center">{alt}</figcaption>}
		</figure>
	);

	if (width !== undefined) {
		return (
			<ResizableMediaWrapper src={src} width={width}>
				{videoElement}
			</ResizableMediaWrapper>
		);
	}

	return videoElement;
};

export default MdxVideo;
