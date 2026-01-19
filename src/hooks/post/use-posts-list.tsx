import { useParams } from "next/navigation";
import { useInfiniteScrollTrigger } from "../common/use-infinite-scroll-trigger";
import { useCategoryByPathname } from "../queries/category";
import { useGetInfinitePosts } from "../queries/post";

export const usePostsList = () => {
  const params = useParams();
  const slug = params.slug as string | undefined;

  const { data: category } = useCategoryByPathname(slug ?? "");
  const {
    data: postsData,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetInfinitePosts(category?.id);

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
