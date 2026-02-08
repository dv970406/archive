import type { Database } from "./database.types";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];
export type CategoryEntity = Database["public"]["Tables"]["category"]["Row"];

export interface Post extends PostEntity {
	category: CategoryEntity | null;
	status: PostStatus;
}

export type EditorTab = "write" | "preview" | "split";
export type PostStatus = "PUBLISHED" | "DRAFT";

export interface AdjacentPosts extends Pick<PostEntity, "slug" | "title"> {}
