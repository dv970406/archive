// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * 디버그용 Express 서버
 * Next.js의 request memoization / data cache가 실제로 몇 번 요청을 보내는지 확인하기 위한 목적
 *
 * 실행: bun run scripts/debug-server.ts
 * 엔드포인트: GET http://localhost:4000/categories
 */

let requestCount = 0;

const server = Bun.serve({
	port: 4000,
	fetch(req) {
		const url = new URL(req.url);
		if (url.pathname === "/categories") {
			requestCount++;
			const timestamp = new Date().toISOString();
			console.log(`\n🔵 [${timestamp}] /categories 요청 #${requestCount}`);

			return Response.json([
				{
					id: 1,
					created_at: "2026-01-05 09:26:34.839795+00",
					title: "SEO",
					order: 1,
					pathname: "seo",
				},
				{
					id: 2,
					created_at: "2026-01-05 09:27:09.841517+00",
					title: "AWS",
					order: 2,
					pathname: "aws",
				},
				{
					id: 3,
					created_at: "2026-01-05 09:27:24.712982+00",
					title: "웹뷰",
					order: 3,
					pathname: "webview",
				},
				{
					id: 4,
					created_at: "2026-01-19 15:15:40.571168+00",
					title: "블로그",
					order: 4,
					pathname: "blog",
				},
			]);
		}

		return new Response("Not Found", { status: 404 });
	},
});

console.log("🟢 디버그 서버 실행 중: http://localhost:4000");
console.log("   GET /categories — 카테고리 목록 반환");
console.log("   요청이 들어올 때마다 카운트를 출력합니다.\n");
