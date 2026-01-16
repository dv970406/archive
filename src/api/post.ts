import { notFound } from "next/navigation";
import { cache } from "react";
import { SUPABASE_ERROR_CODE } from "@/lib/constant/error-code";
import supabaseClient from "@/lib/supabase/client";
import type { PostEntity } from "@/types/post";

export const fetchPosts = cache(
  async ({
    from,
    to,
    categoryId,
  }: {
    from: number;
    to: number;
    categoryId?: number;
  }) => {
    const supabase = await supabaseClient();
    const request = supabase
      .from("post")
      .select("*, category: category!category_id (*)")
      .eq("status", "PUBLISHED")
      .order("published_at", {
        ascending: false,
      })
      .range(from, to);

    if (categoryId) {
      request.eq("category_id", categoryId);
    }

    const { data, error } = await request;

    if (error) throw error;
    return data;
  }
);

export const fetchPost = cache(async (postId: number) => {
  const supabase = await supabaseClient();
  const { data, error } = await supabase
    .from("post")
    .select("*, category: category!category_id (*)")
    .eq("id", postId)
    .single();

  if (error) {
    if (error?.code === SUPABASE_ERROR_CODE.NOT_FOUND) {
      notFound();
      return;
    }
    throw error;
  }
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
  extends Partial<
    Pick<
      PostEntity,
      | "content"
      | "title"
      | "category_id"
      | "thumbnail"
      | "status"
      | "published_at"
    >
  > {
  id: PostEntity["id"];
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
