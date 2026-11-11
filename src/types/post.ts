/** 카테고리 (content/categories.json 의 항목) */
export interface Category {
	/** URL 경로 세그먼트(/category/<pathname>)이자 포스트 프론트매터 category 의 값 */
	pathname: string;
	title: string;
	/** 카테고리 필터 노출 순서 (오름차순) */
	order: number;
}

/** MDX 파일 프론트매터 (content/posts/<slug>.mdx) */
export interface PostFrontmatter {
	title: string;
	/** Category.pathname 중 하나 */
	category: string;
	/** 썸네일 경로(/posts/<slug>/파일명) 또는 절대 URL. 없으면 플레이스홀더 이미지를 사용한다 */
	thumbnail?: string | null;
	/** AI 요약. 메타 description, RSS description, JSON-LD description 에 쓰인다 */
	summary?: string | null;
	/** 발행 시각 (ISO 8601) */
	publishedAt: string;
	/** 마지막 수정 시각 (ISO 8601). sitemap lastModified, JSON-LD dateModified 에 쓰인다 */
	updatedAt: string;
}

/** 파일에서 읽어 검증을 마친 포스트 */
export interface Post {
	/** 파일명(확장자 제외) */
	slug: string;
	title: string;
	category: Category;
	thumbnail: string | null;
	summary: string | null;
	publishedAt: string;
	updatedAt: string;
	/** 프론트매터를 제외한 MDX 본문 */
	content: string;
}

/** 피드 카드에 필요한 최소 데이터. 본문 대신 발췌문만 담아 클라이언트 전송량을 줄인다 */
export interface PostCard {
	slug: string;
	title: string;
	categoryTitle: string;
	thumbnail: string | null;
	publishedAt: string;
	/** 서버(빌드 시점)에서 계산한 상대 시간 라벨. 클라이언트에서 TimeAgo 가 갱신한다 */
	publishedAtLabel: string;
	excerpt: string;
}

export interface AdjacentPost {
	slug: string;
	title: string;
}
