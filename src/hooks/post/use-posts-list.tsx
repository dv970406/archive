import { useSearchParams } from "next/navigation";
import { useInfiniteScrollTrigger } from "../common/use-infinite-scroll-trigger";
import { useGetInfinitePosts } from "../queries/post";

export const usePostsList = () => {
	const searchParams = useSearchParams();

	const categoryId = searchParams.get("categoryId");
	const {
		data: postsData,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useGetInfinitePosts(categoryId ? Number.parseInt(categoryId) : undefined);

	const postsList = postsData?.pages.flat();

	const { observerRef } = useInfiniteScrollTrigger({
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	});

	return {
		postsList,
		observerRef,
		isFetchingNextPage,
	};
};
