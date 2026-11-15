import Anthropic from "@anthropic-ai/sdk";

/** 글 본문을 한글 3~7줄로 요약한다. ANTHROPIC_API_KEY 환경변수(.env)가 필요하다 */
export const generateSummary = async (content: string): Promise<string> => {
	const apiKey = process.env.ANTHROPIC_API_KEY;
	if (!apiKey) {
		throw new Error(
			"ANTHROPIC_API_KEY 환경변수가 필요합니다. (.env 파일 확인)",
		);
	}

	const client = new Anthropic({ apiKey });

	const summaryResponse = await client.messages.create({
		// 한글 3-7줄 요약
		// 실제 사용: 150-300 토큰 정도이므로 넉넉히 500으로 설정
		max_tokens: 500,
		messages: [
			{
				content: `
				 다음 규칙을 지켜서 요약이 필요합니다.

				 1. 존칭을 사용해주세요.
				 2. 적절히 개행을 넣되, 개행 포함 없이 내용만 3~7줄로 요약해주세요.
				 3. ~하셨습니다. ~이십니다. 같이 사람을 높이는 표현보다는 정보 전달 중심체로 ~합니다. ~입니다.로 요약해주세요.
				 4. 핵심만 요약해주세요.
				 5. '요약한 글은 아래와 같아요', '답변이 마음에 드시나요?' 같은 불필요한 서론, 정리말 없이 순수히 콘텐츠만 요약해서 답변해주세요.

				 이제 아래의 글을 요약해주세요.
				 \n\n${content}`,
				role: "user",
			},
		],
		model: "claude-sonnet-4-5-20250929",
		// 글 요약 목적이므로 창의성(temperature)은 필요없어서 0으로 부여
		temperature: 0,
	});

	// 응답에서 텍스트 블록만 안전하게 추출
	const textBlock = summaryResponse.content.find(
		(block) => block.type === "text",
	);
	if (!textBlock || textBlock.type !== "text") {
		throw new Error("AI 응답에서 텍스트를 찾을 수 없습니다.");
	}

	const summary = textBlock.text.trim();
	if (summary === "") {
		throw new Error("AI 요약 결과가 비어 있습니다.");
	}

	return summary;
};
