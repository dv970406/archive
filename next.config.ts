import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// 글은 content/ 의 MDX 파일을 빌드 시점에 읽어 정적으로 생성하므로 런타임 데이터 소스나 원격 이미지 설정이 없다
const nextConfig = (phase: string): NextConfig => {
	const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;

	return {
		// 개발 서버에서만 `*.dev.ts`·`*.dev.tsx` 라우트 파일을 인식한다. 프로덕션 빌드에는 포함되지 않아 배포 결과는 완전한 정적 사이트로 유지된다
		// - app/posts/[slug]/[...file]/route.dev.ts: content/drafts/<slug>/ 의 초안 미디어 서빙
		// - app/(editor)/post/create/page.dev.tsx, app/(editor)/post/[slug]/update/page.dev.tsx: 파일에 직접 쓰는 MDX 에디터
		pageExtensions: isDevServer
			? ["tsx", "ts", "dev.tsx", "dev.ts"]
			: ["tsx", "ts"],
		...(isDevServer && {
			experimental: {
				serverActions: {
					// 에디터가 Server Action 으로 이미지·영상을 올린다 (기본 한도 1MB)
					bodySizeLimit: "200mb",
				},
			},
		}),
	};
};

export default nextConfig;
