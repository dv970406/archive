/** biome-ignore-all lint/suspicious/noConsole: CLI 스크립트 */

// 초안 공개
//
// 사용법: pnpm publish-post <slug> [--summarize]
//
// 1) content/drafts/<slug>.mdx → content/posts/<slug>.mdx 로 이동
// 2) content/drafts/<slug>/ (이미지·영상) 가 있으면 public/posts/<slug>/ 로 이동
// 3) publishedAt / updatedAt 을 현재 시각으로 갱신
// 4) --summarize 가 있으면 AI 요약을 생성해 summary 에 기록
//
// 공개한 글을 나중에 수정했다면 프론트매터의 updatedAt 을 직접 갱신한다.
// (개발 서버의 에디터 /post/<slug>/update 에서 저장하면 자동으로 갱신된다)

import fs from "node:fs";
import { generateSummary } from "../src/lib/ai/summary";
import {
	assertSlug,
	getDraftPath,
	getPostPath,
	parseArgs,
	readPostFile,
	relocatePost,
	toRelative,
} from "./lib/post-file";

const main = async () => {
	const { positional, options } = parseArgs(process.argv.slice(2));
	const slug = assertSlug(positional[0]);

	const draftPath = getDraftPath(slug);
	if (!fs.existsSync(draftPath)) {
		throw new Error(`초안이 없습니다: ${toRelative(draftPath)}`);
	}

	const { content } = readPostFile(draftPath);

	// 본문이 비어 있으면 요약도 의미가 없으므로 먼저 막는다
	if (content.trim() === "") {
		throw new Error("본문이 비어 있습니다.");
	}

	const now = new Date().toISOString();
	const updateData: Record<string, unknown> = {
		publishedAt: now,
		updatedAt: now,
	};

	if (options.summarize) {
		console.log("AI 요약을 생성합니다...");
		updateData.summary = await generateSummary(content);
	}

	// 글 파일과 미디어 폴더(content/drafts/<slug>/ → public/posts/<slug>/)를 함께 옮긴다
	relocatePost(slug, "draft", "post", updateData);

	console.log(`공개했습니다: ${toRelative(getPostPath(slug))}`);
	console.log("- 변경 사항을 커밋/푸시하면 배포됩니다.");
};

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
