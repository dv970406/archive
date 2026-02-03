import { unstable_cache } from "next/cache";
import supabaseClient from "@/lib/supabase/client";

// category 데이터는 바뀔 일이 거의 드물어 전반적으로 data cache의 revalidate를 false로 주어 무기한 유지.
// category 데이터가 바뀌더라도 재빌드를 통해 반영

// 리퀘스트 메모이제이션은 supabaseClient 내부의 fetch에서 자동확장되어 적용됨
export const fetchAllCategories = unstable_cache(
	async () => {
		const { data, error } = await supabaseClient
			.from("category")
			.select("*")
			.order("order");

		if (error) throw error;
		return data;
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
