import type { Database } from "./database.types";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];
export type CategoryEntity = Database["public"]["Tables"]["category"]["Row"];

export interface Post extends PostEntity {
	category: CategoryEntity;
}

export type EditorTab = "write" | "preview" | "split";
