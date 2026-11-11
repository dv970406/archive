import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// 글은 content/ 의 MDX 파일을 빌드 시점에 읽어 정적으로 생성하므로 런타임 데이터 소스나 원격 이미지 설정이 없다
const nextConfig = (phase: string): NextConfig => ({
	// 개발 서버에서만 `*.dev.ts` 라우트 파일을 인식한다.
	// content/drafts/<slug>/ 의 초안 미디어를 서빙하는 app/posts/[slug]/[...file]/route.dev.ts 가 여기에 해당하며,
	// 프로덕션 빌드에는 포함되지 않아 배포 결과는 완전한 정적 사이트로 유지된다
	pageExtensions:
		phase === PHASE_DEVELOPMENT_SERVER
			? ["tsx", "ts", "dev.ts"]
			: ["tsx", "ts"],
});

export default nextConfig;
