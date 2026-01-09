"use client";

import { useAllCategories } from "@/hooks/queries/category";

const CategoryFilter = () => {
	const { data: allCategories } = useAllCategories();

	return <div></div>;
};

export default CategoryFilter;
