import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "@/api/category";
import { QUERY_KEYS } from "@/lib/query-keys";

// SSR 환경에서 prefetch를 위해 useQuery와 분리
export const allCategoriesQuery = {
	queryKey: QUERY_KEYS.category.all,
	queryFn: fetchAllCategories,
};

export const useAllCategories = () => {
	return useQuery(allCategoriesQuery);
};
