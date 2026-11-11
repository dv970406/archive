import { useEffect, useRef } from "react";

interface IUseInfiniteScrollTriggerProps {
	hasNextPage: boolean;
	onLoadMore: () => void;
}

/** 감시 요소(observerRef)가 뷰포트에 들어오면 onLoadMore 를 호출한다 */
export const useInfiniteScrollTrigger = ({
	hasNextPage,
	onLoadMore,
}: IUseInfiniteScrollTriggerProps) => {
	const observerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const currentElement = observerRef.current;
		if (!currentElement || !hasNextPage) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					onLoadMore();
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(currentElement);

		return () => {
			observer.disconnect();
		};
	}, [hasNextPage, onLoadMore]);

	return {
		observerRef,
	};
};
