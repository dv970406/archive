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
    list: (categoryId?: number) => ["post", "list", { categoryId }],
    byId: (postId: number) => ["post", { postId }],
    draft: ["post", "draft"],
  },
};
