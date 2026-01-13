export const QUERY_KEYS = {
	auth: {
		user: ["auth", "user"],
	},
	category: {
		all: ["categories"],
		byId: (categoryId: string) => ["category", { categoryId }],
	},
	post: {
		all: ["posts"],
		list: (categoryId?: number) => ["post", "list", { categoryId }],
		byId: (postId: number) => ["post", { postId }],
		draft: ["post", "draft"],
	},
};
