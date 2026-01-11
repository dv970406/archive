import { cache } from "react";

import supabaseClient from "@/lib/supabase/client";
import type { PostEntity } from "@/types/post";

export const fetchPost = cache(async (postId: number) => {
	const supabase = await supabaseClient();
	const { data, error } = await supabase
		.from("post")
		.select("*, category: category!category_id (*)")
		.eq("id", postId)
		.single();

	if (error) throw error;
	return data;
});

export const fetchSavedPostDraft = async () => {
	const supabase = await supabaseClient();
	const { data, error } = await supabase
		.from("post")
		.select("*, category: category!category_id (*)")
		.eq("status", "DRAFT")
		.single();

	if (error) throw error;
	return data;
};

type ICreatePostProps = Pick<
	PostEntity,
	"content" | "title" | "category_id" | "thumbnail"
>;
export const createPost = async ({
	category_id,
	content,
	title,
	thumbnail,
}: ICreatePostProps) => {
	const supabase = await supabaseClient();
	const { data, error } = await supabase
		.from("post")
		.insert({
			content,
			category_id,
			title,
			thumbnail,
			status: "DRAFT",
		})
		.select()
		.single();

	if (error) throw error;

	return data;
};

interface IUpdatePostProps
	extends Pick<
		PostEntity,
		| "content"
		| "title"
		| "category_id"
		| "thumbnail"
		| "status"
		| "published_at"
	> {
	id: number;
}
export const updatePost = async ({ id, ...rest }: IUpdatePostProps) => {
	const supabase = await supabaseClient();
	const { data, error } = await supabase
		.from("post")
		.update(rest)
		.eq("id", id)
		.select()
		.single();

	if (error) throw error;

	return data;
};
