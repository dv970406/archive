import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	images: {
		/* 로컬 개발환경의 경우 storage의 도메인이 로컬호스트(127.0.0.1)인데 이 때 이미지 최적화를 꺼야 이미지가 제대로 렌더링됨 */
		/* supabase stroage (local) : http://127.0.0.1:54321/storage/~~ */
		unoptimized: process.env.NODE_ENV === "development",
		remotePatterns: [
			new URL(
				`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/v1/object/public/**`,
			),
		],
	},
};

export default nextConfig;
