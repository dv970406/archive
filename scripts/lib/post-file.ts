// 글 파일 유틸은 개발 서버 전용 에디터와 함께 쓰도록 src/lib/content/post-files.ts 에 있다.
// 스크립트 전용인 인자 파싱만 여기에 둔다

export * from "../../src/lib/content/paths";
export * from "../../src/lib/content/post-files";

/** 값을 받지 않는 플래그. 뒤따르는 positional 인자를 값으로 삼지 않도록 구분한다 */
const BOOLEAN_FLAGS = new Set(["summarize"]);

/** `<positional> --key value --flag` 형태의 인자를 파싱한다 */
export const parseArgs = (argv: string[]) => {
	const positional: string[] = [];
	const options: Record<string, string | true> = {};

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (!arg.startsWith("--")) {
			positional.push(arg);
			continue;
		}

		const key = arg.slice(2);
		const next = argv[i + 1];
		if (
			!BOOLEAN_FLAGS.has(key) &&
			next !== undefined &&
			!next.startsWith("--")
		) {
			options[key] = next;
			i++;
		} else {
			options[key] = true;
		}
	}

	return { positional, options };
};
