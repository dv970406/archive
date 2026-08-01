import type { Database } from "./database.types";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];
export type CategoryEntity = Database["public"]["Tables"]["category"]["Row"];

export interface Post extends PostEntity {
	category: CategoryEntity | null;
}

export type EditorTab = "write" | "preview" | "split";
/**
 * 포스트 공개 상태 ("DRAFT" | "PUBLISHED" | "HIDDEN")
 * - DRAFT: 임시저장 (발행 전)
 * - PUBLISHED: 공개
 * - HIDDEN: 발행했다가 다시 내린 상태 (어드민만 조회 가능)
 *
 * DB의 post_status enum에서 파생되므로 스키마와 어긋나면 컴파일 에러가 난다.
 */
export type PostStatus = Database["public"]["Enums"]["post_status"];

export interface AdjacentPosts extends Pick<PostEntity, "slug" | "title"> {}
