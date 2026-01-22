import { notFound } from "next/navigation";
import { cache } from "react";
import { SUPABASE_ERROR_CODE } from "@/lib/constant/error-code";
import supabaseClient from "@/lib/supabase/client";
import type { PostEntity } from "@/types/post";

export const fetchAllPostsForUtils = cache(async () => {
  const { error, data } = await supabaseClient
    .from("post")
    .select("slug, updated_at")
    .eq("status", "PUBLISHED");

  if (error) throw error;
  return data;
});

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
    const request = supabaseClient
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
  },
);

export const fetchPostById = cache(async (postId: number) => {
  const { data, error } = await supabaseClient
    .from("post")
    .select("*, category: category!category_id (*)")
    .eq("id", postId)
    .single();

  if (error) {
    if (error?.code === SUPABASE_ERROR_CODE.NOT_FOUND) {
      notFound();
    }
    throw error;
  }
  return data;
});

export const fetchPostBySlug = cache(async (slug: string) => {
  const { data, error } = await supabaseClient
    .from("post")
    .select("*, category: category!category_id (*)")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error?.code === SUPABASE_ERROR_CODE.NOT_FOUND) {
      notFound();
    }
    throw error;
  }
  return data;
});

export const fetchSavedPostDraft = async () => {
  const { data, error } = await supabaseClient
    .from("post")
    .select("*, category: category!category_id (*)")
    .eq("status", "DRAFT")
    .single();

  if (error) throw error;
  return data;
};

type ICreatePostProps = Pick<
  PostEntity,
  "content" | "title" | "category_id" | "thumbnail" | "slug"
>;
export const createPost = async ({
  category_id,
  content,
  title,
  thumbnail,
  slug,
}: ICreatePostProps) => {
  const { data, error } = await supabaseClient
    .from("post")
    .insert({
      content,
      category_id,
      title,
      thumbnail,
      status: "DRAFT",
      slug,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

interface IUpdatePostProps extends Partial<
  Pick<
    PostEntity,
    | "content"
    | "title"
    | "category_id"
    | "thumbnail"
    | "status"
    | "view_count"
    | "published_at"
    | "updated_at"
    | "slug"
  >
> {
  id: PostEntity["id"];
}
export const updatePost = async ({ id, ...rest }: IUpdatePostProps) => {
  const { data, error } = await supabaseClient
    .from("post")
    .update(rest)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const increasePostViewCount = async (postId: number) => {
  const { error } = await supabaseClient.rpc("increase_post_view_count", {
    post_id: postId,
  });

  if (error) throw error;
};
