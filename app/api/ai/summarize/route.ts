import type { TextBlock } from "@anthropic-ai/sdk/resources";
import { type NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/api/ai";

// ⭐️ Claude AI API 실행은 반드시 서버에서 이루어져야함.
// why? 클라이언트에게 요청이 가능하게 하면 Key 노출의 위험, 비용 과다 청구 등의 문제가 발생할 수 있기 때문
// 따라서 클라이언트가 곧바로 Claude AI로 요청을 보내는게 아니라 클라이언트는 Route Handler로 요청을 보내어 Next 서버가 AI API 요청을 처리하게 한다.
export async function POST(request: NextRequest) {
	const { content } = await request.json();

	if (!content) {
		return NextResponse.json(
			{ error: "content가 필요합니다!" },
			{ status: 400 },
		);
	}

	const { content: summarizedContent } = await generateSummary(content);

	const { text: summarizedText } = summarizedContent[0] as TextBlock;

	return NextResponse.json(summarizedText);
}
