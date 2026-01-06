"use client";

import { useAllCategories } from "@/hooks/queries/use-all-categories";

const CategoryFilter = () => {
	const { data: allCategories } = useAllCategories();

	return <div></div>;
};

export default CategoryFilter;
