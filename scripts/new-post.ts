/** biome-ignore-all lint/suspicious/noConsole: CLI 스크립트 */

// 새 글 초안 생성
//
// 사용법: pnpm new-post <slug> --category <pathname> [--title "제목"]
//
// content/drafts/<slug>.mdx 를 프론트매터 골격과 함께 만든다.
// drafts 폴더는 git 에 포함되지 않으며, 개발 서버(pnpm dev)에서만 미리보기로 노출된다.
// 작성이 끝나면 `pnpm publish-post <slug>` 로 공개한다.

import {
	assertSlug,
	findPostFile,
	getDraftPath,
	parseArgs,
	readCategoryPathnames,
	toRelative,
	writePostFile,
} from "./lib/post-file";

const main = () => {
	const { positional, options } = parseArgs(process.argv.slice(2));
	const slug = assertSlug(positional[0]);

	const existing = findPostFile(slug);
	if (existing) {
		throw new Error(`이미 존재하는 글입니다: ${toRelative(existing)}`);
	}

	const categories = readCategoryPathnames();
	const category = options.category;
	if (typeof category !== "string" || !categories.includes(category)) {
		throw new Error(
			`--category 는 다음 중 하나여야 합니다: ${categories.join(", ")}`,
		);
	}

	const title = typeof options.title === "string" ? options.title : slug;
	const now = new Date().toISOString();

	const filePath = getDraftPath(slug);
	writePostFile(
		filePath,
		{
			title,
			category,
			publishedAt: now,
			updatedAt: now,
		},
		"여기에 본문을 작성하세요.\n",
	);

	console.log(`초안을 만들었습니다: ${toRelative(filePath)}`);
	console.log(
		`- 썸네일: 이미지를 public/posts/${slug}/ 에 넣고 프론트매터에 thumbnail: /posts/${slug}/<파일명> 을 추가하세요.`,
	);
	console.log(
		`- 본문 이미지도 같은 폴더에 넣고 <Image src="/posts/${slug}/<파일명>" width={100} /> 로 참조하세요.`,
	);
	console.log(`- 공개: pnpm publish-post ${slug} --summarize`);
};

try {
	main();
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}
