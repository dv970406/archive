import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CategoryFilter from "@/components/pages/index/category-filter";
import { getAllCategoriesQuery } from "@/hooks/queries/category";
import { getQueryClient } from "@/lib/utils/tanstack-query";

const HomePage = async () => {
	const queryClient = getQueryClient();

	await Promise.all([queryClient.prefetchQuery(getAllCategoriesQuery)]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<main className="container mx-auto px-4 py-12 max-w-4xl">
				<CategoryFilter />
			</main>
		</HydrationBoundary>
	);
};

export default HomePage;
