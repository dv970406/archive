import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export const useInfiniteScrollTrigger = ({
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
}: Pick<
	UseInfiniteQueryResult,
	"hasNextPage" | "isFetchingNextPage" | "fetchNextPage"
>) => {
	const observerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);

		const currentElement = observerRef.current;

		if (currentElement) {
			observer.observe(currentElement);
		}

		return () => {
			if (currentElement) {
				observer.unobserve(currentElement);
			}
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	return {
		observerRef,
	};
};
