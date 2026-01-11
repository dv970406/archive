export const QUERY_KEYS = {
	category: {
		all: ["categories"],
		byId: (categoryId: string) => ["category", categoryId],
	},
	post: {
		all: ["posts"],
		list: ["post", "list"],
		byId: (postId: number) => ["post", postId],
		draft: ["post", "draft"],
	},
};
