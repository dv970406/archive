"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { useMediaResize } from "@/context/media-resize-context";
import { cn } from "@/lib/style/tailwind";

const MIN_WIDTH = 10;
const MAX_WIDTH = 100;

interface ResizableMediaWrapperProps {
	src: string;
	width: number;
	children: ReactNode;
}

const ResizableMediaWrapper = ({
	src,
	width,
	children,
}: ResizableMediaWrapperProps) => {
	const resizeContext = useMediaResize();
	const isResizable = resizeContext !== null;
	// onResize를 ref로 캡처하여 effect dependency에서 제거 → 드래그 중 effect 재실행 방지
	const onResizeRef = useRef(resizeContext?.onResize);
	useEffect(() => {
		onResizeRef.current = resizeContext?.onResize;
	}, [resizeContext]);

	const [displayWidth, setDisplayWidth] = useState(width);
	const [isDragging, setIsDragging] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const dragStartXRef = useRef(0);
	const dragStartWidthRef = useRef(width);
	const displayWidthRef = useRef(width);

	// width prop 변경 시 (MDX 재컴파일 후) 로컬 상태 동기화
	useEffect(() => {
		setDisplayWidth(width);
	}, [width]);

	// isDragging 기반 이벤트 리스너 등록/해제 (메모리 누수 방지)
	// cleanup에 body 스타일 초기화 포함 → 드래그 중 언마운트 시에도 커서·선택 잠금 해제
	useEffect(() => {
		if (!isDragging) return;

		const handleMouseMove = (e: MouseEvent) => {
			const containerWidth =
				containerRef.current?.parentElement?.offsetWidth ?? 800;
			const deltaPercent = Math.round(
				((e.clientX - dragStartXRef.current) / containerWidth) * 100,
			);
			const next = Math.min(
				MAX_WIDTH,
				Math.max(MIN_WIDTH, dragStartWidthRef.current + deltaPercent),
			);
			// 값이 동일하면 re-render 생략 (경계값 도달 시 불필요한 렌더 방지)
			if (next === displayWidthRef.current) return;
			displayWidthRef.current = next;
			setDisplayWidth(next);
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			onResizeRef.current?.(src, displayWidthRef.current);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};
	}, [isDragging, src]);

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		dragStartXRef.current = e.clientX;
		dragStartWidthRef.current = displayWidth;
		displayWidthRef.current = displayWidth;
		setIsDragging(true);
		document.body.style.cursor = "ew-resize";
		document.body.style.userSelect = "none";
	};

	return (
		<div
			ref={containerRef}
			style={{ width: `${displayWidth}%` }}
			className={cn("relative block mx-auto", isResizable && "group/media")}
		>
			{children}

			{isResizable && (
				<>
					{/* 우측 드래그 핸들 — z-10으로 video 컴포지팅 레이어 위에 렌더 */}
					<button
						type="button"
						tabIndex={-1}
						aria-label="미디어 너비 조절"
						onMouseDown={handleMouseDown}
						className={cn(
							"absolute right-0 top-1/2 -translate-y-1/2",
							"flex items-center justify-center",
							"w-3 h-12 rounded-full",
							"bg-white/90 dark:bg-zinc-700/90 border border-zinc-300 dark:border-zinc-600 shadow-md",
							"cursor-ew-resize z-10",
							"transition-opacity duration-150",
							"opacity-0 group-hover/media:opacity-100",
							"focus:outline-none",
							isDragging &&
								"opacity-100 bg-primary/90 border-primary scale-110",
						)}
					>
						<div className="flex flex-col gap-0.5">
							<div className="w-0.5 h-0.5 rounded-full bg-zinc-500" />
							<div className="w-0.5 h-0.5 rounded-full bg-zinc-500" />
							<div className="w-0.5 h-0.5 rounded-full bg-zinc-500" />
						</div>
					</button>

					{/* 드래그 중 너비 툴팁 */}
					{isDragging && (
						<div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-900/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
							{displayWidth}%
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default ResizableMediaWrapper;
