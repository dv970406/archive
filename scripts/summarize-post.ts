/** biome-ignore-all lint/suspicious/noConsole: CLI 스크립트 */

// AI 요약 생성
//
// 사용법: pnpm summarize <slug>
//
// 글 본문을 AI 로 요약해 프론트매터의 summary 에 기록한다. (공개 글과 초안 모두 대상)
// summary 는 메타 description, RSS description, JSON-LD description 에 쓰인다.

import { generateSummary } from "./lib/ai-summary";
import {
	assertSlug,
	findPostFile,
	parseArgs,
	readPostFile,
	toRelative,
	writePostFile,
} from "./lib/post-file";

const main = async () => {
	const { positional } = parseArgs(process.argv.slice(2));
	const slug = assertSlug(positional[0]);

	const filePath = findPostFile(slug);
	if (!filePath) {
		throw new Error(`글을 찾을 수 없습니다: ${slug}`);
	}

	const { data, content } = readPostFile(filePath);
	if (content.trim() === "") {
		throw new Error("본문이 비어 있습니다.");
	}

	console.log(`AI 요약을 생성합니다: ${toRelative(filePath)}`);
	const summary = await generateSummary(content);

	writePostFile(filePath, { ...data, summary }, content);

	console.log("요약을 기록했습니다:\n");
	console.log(summary);
};

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
