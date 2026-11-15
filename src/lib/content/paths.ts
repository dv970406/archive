import path from "node:path";

export const PROJECT_ROOT = process.cwd();
export const CONTENT_DIR = path.join(PROJECT_ROOT, "content");
/** 공개 글 */
export const POSTS_DIR = path.join(CONTENT_DIR, "posts");
/** 초안. git 에 포함되지 않으며 개발 서버에서만 미리보기로 노출된다 */
export const DRAFTS_DIR = path.join(CONTENT_DIR, "drafts");
/** 공개 글의 이미지·영상 */
export const PUBLIC_POSTS_DIR = path.join(PROJECT_ROOT, "public", "posts");
/** 카테고리 정의 파일 */
export const CATEGORIES_FILE = path.join(CONTENT_DIR, "categories.json");
