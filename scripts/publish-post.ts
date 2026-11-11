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

import fs from "node:fs";
import path from "node:path";
import { generateSummary } from "./lib/ai-summary";
import {
	assertSlug,
	DRAFTS_DIR,
	getDraftPath,
	getPostPath,
	PUBLIC_POSTS_DIR,
	parseArgs,
	readPostFile,
	toRelative,
	writePostFile,
} from "./lib/post-file";

const main = async () => {
	const { positional, options } = parseArgs(process.argv.slice(2));
	const slug = assertSlug(positional[0]);

	const draftPath = getDraftPath(slug);
	const postPath = getPostPath(slug);

	if (!fs.existsSync(draftPath)) {
		throw new Error(`초안이 없습니다: ${toRelative(draftPath)}`);
	}
	if (fs.existsSync(postPath)) {
		throw new Error(`이미 공개된 글이 있습니다: ${toRelative(postPath)}`);
	}

	const draftMediaDir = path.join(DRAFTS_DIR, slug);
	const publicMediaDir = path.join(PUBLIC_POSTS_DIR, slug);
	if (fs.existsSync(draftMediaDir) && fs.existsSync(publicMediaDir)) {
		throw new Error(
			`미디어 폴더가 양쪽에 모두 있습니다. 하나로 합친 뒤 다시 실행하세요: ${toRelative(draftMediaDir)}, ${toRelative(publicMediaDir)}`,
		);
	}

	const { data, content } = readPostFile(draftPath);

	// 본문이 비어 있으면 요약도 의미가 없으므로 먼저 막는다
	if (content.trim() === "") {
		throw new Error("본문이 비어 있습니다.");
	}

	const now = new Date().toISOString();
	const nextData: Record<string, unknown> = {
		...data,
		publishedAt: now,
		updatedAt: now,
	};

	if (options.summarize) {
		console.log("AI 요약을 생성합니다...");
		nextData.summary = await generateSummary(content);
	}

	// 미디어 폴더 이동
	if (fs.existsSync(draftMediaDir)) {
		fs.mkdirSync(PUBLIC_POSTS_DIR, { recursive: true });
		fs.renameSync(draftMediaDir, publicMediaDir);
		console.log(
			`미디어를 옮겼습니다: ${toRelative(draftMediaDir)} → ${toRelative(publicMediaDir)}`,
		);
	}

	// 글 파일 이동 (프론트매터 갱신 후 저장하고 초안은 삭제)
	writePostFile(postPath, nextData, content);
	fs.rmSync(draftPath);

	console.log(`공개했습니다: ${toRelative(postPath)}`);
	console.log("- 변경 사항을 커밋/푸시하면 배포됩니다.");
};

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
