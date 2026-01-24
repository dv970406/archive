import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories, fetchCategoryByPathname } from "@/api/category";
import { QUERY_KEYS } from "@/lib/query-keys";

// SSR 환경에서 prefetch를 위해 useQuery와 분리
export const getAllCategoriesQuery = {
	queryKey: QUERY_KEYS.category.all,
	queryFn: fetchAllCategories,
};

export const useAllCategories = () => {
	return useQuery(getAllCategoriesQuery);
};

export const getCategoryByPathnameQuery = (pathname: string) => ({
	queryKey: QUERY_KEYS.category.byPathname(pathname),
	queryFn: () => fetchCategoryByPathname(pathname),
});

export const useCategoryByPathname = (pathname: string) => {
	return useQuery({
		...getCategoryByPathnameQuery(pathname),
		enabled: !!pathname,
	});
};
