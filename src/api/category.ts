import { unstable_cache } from "next/cache";
import { cache } from "react";
import supabaseClient from "@/lib/supabase/client";

export const fetchAllCategories = async () => {
	const { data, error } = await supabaseClient
		.from("category")
		.select("*")
		.order("order");

	if (error) throw error;
	return data;
};

export const fetchAllCategoriesForUtils = cache(async () => {
	const { data, error } = await supabaseClient
		.from("category")
		.select("pathname")
		.order("order");

	if (error) throw error;

	return data;
});

export const fetchCategoryByPathname = cache(async (pathname: string) => {
	const { data, error } = await supabaseClient
		.from("category")
		.select("*")
		.eq("pathname", pathname)
		.single();

	if (error) throw error;

	return data;
});
