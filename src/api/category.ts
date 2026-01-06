import supabaseClient from "@/lib/supabase/client";

export const fetchAllCategories = async () => {
	const supabase = await supabaseClient();
	const { data, error } = await supabase
		.from("category")
		.select("*")
		.order("created_at");

	if (error) throw error;

	return data;
};
