import { unstable_cache } from "next/cache";
import supabaseClient from "@/lib/supabase/client";

export const fetchAllCategories = async () => {
	const { data, error } = await supabaseClient
		.from("category")
		.select("*")
		.order("order");

	if (error) throw error;
	return data;
};

export const cachedAllCategories = unstable_cache(
	async () => {
		const categories = await fetchAllCategories();

		return categories;
	},
	["all-categories"],
	{
		revalidate: false,
	},
);

export const fetchAllCategoriesForUtils = unstable_cache(
	async () => {
		const { data, error } = await supabaseClient
			.from("category")
			.select("pathname")
			.order("order");

		if (error) throw error;

		return data;
	},
	["all-categories-for-utils"],
	{
		revalidate: false,
	},
);

export const fetchCategoryByPathname = unstable_cache(
	async (pathname: string) => {
		const { data, error } = await supabaseClient
			.from("category")
			.select("*")
			.eq("pathname", pathname)
			.single();

		if (error) throw error;

		return data;
	},
	["category-by-pathname"],
	{
		revalidate: false,
	},
);
