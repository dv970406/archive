"use client";

import { useEffect, useRef } from "react";

interface MdxVideoProps {
	src: string;
	alt?: string;
}

const MdxVideo = ({ src, alt }: MdxVideoProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

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
		return () => observer.disconnect();
	}, []);

	if (!src) return null;
	return (
		<figure className="shrink-0">
			<video
				ref={videoRef}
				src={src}
				loop
				muted
				playsInline
				preload="metadata"
				className="w-full rounded-lg my-6"
			/>
			{alt && <figcaption className="text-center">{alt}</figcaption>}
		</figure>
	);
};

export default MdxVideo;
