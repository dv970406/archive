export const QUERY_KEYS = {
	auth: {
		user: ["auth", "user"],
	},
	category: {
		all: ["categories"],
		byId: (categoryId: number) => ["category", { categoryId }],
		byPathname: (pathname: string) => ["category", { pathname }],
	},
	post: {
		all: ["posts"],
		// 카테고리별 리스트를 한 번에 무효화하기 위한 공통 접두사
		// (list(categoryId)로 무효화하면 categoryId가 다른 쿼리와 매치되지 않는다)
		lists: ["post", "list"],
		list: (categoryId?: number) => ["post", "list", { categoryId }],
		bySlug: (slug: string) => ["post", { slug }],
		draft: ["post", "draft"],
		hidden: ["post", "hidden"],
	},
};
