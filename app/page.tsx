import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CategoryFilter from "@/components/pages/index/category-filter";
import { allCategoriesQuery } from "@/hooks/queries/use-all-categories";
import { getQueryClient } from "@/lib/utils";

const HomePage = async () => {
	const queryClient = getQueryClient();

	await Promise.all([queryClient.prefetchQuery(allCategoriesQuery)]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<main className="container mx-auto px-4 py-12 max-w-4xl">
				<CategoryFilter />
			</main>
		</HydrationBoundary>
	);
};

export default HomePage;
