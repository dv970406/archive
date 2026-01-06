export const QUERY_KEYS = {
	category: {
		all: ["categories"],
		byId: (categoryId: string) => ["category", categoryId],
	},
};
