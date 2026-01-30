import { unstable_cache } from "next/cache";
import { cache } from "react";
import supabaseClient from "@/lib/supabase/client";

// 리퀘스트 메모이제이션은 supabaseClient 내부의 fetch에서 자동확장되어 적용됨
export const fetchAllCategories = unstable_cache(async () => {
	const { data, error } = await supabaseClient
		.from("category")
		.select("*")
		.order("order");

	if (error) throw error;
	return data;
}, ["all-categories"]);

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
