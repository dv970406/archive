// 요약 응답을 기다리는 최대 시간(밀리초)
// AI API가 에러 없이 응답만 지연되는 경우에도 발행이 무한정 막히지 않도록,
// 이 시간을 넘기면 실패로 취급한다(호출부에서 요약 없이 발행을 진행).
const SUMMARIZE_TIMEOUT_MS = 30_000;

// 클라이언트에서 AI Route Handler로 요청을 보내는 API 함수
export const summarizeContent = async (content: string): Promise<string> => {
	const res = await fetch("/api/ai/summarize", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ content }),
		signal: AbortSignal.timeout(SUMMARIZE_TIMEOUT_MS),
	});

	if (!res.ok) {
		throw new Error("AI 요약 생성에 실패했습니다.");
	}

	const summarizedContent: unknown = await res.json();

	// 문자열이 아니거나 빈 응답은 요약으로 저장하지 않도록 실패로 취급한다
	if (
		typeof summarizedContent !== "string" ||
		summarizedContent.trim() === ""
	) {
		throw new Error("AI 요약 생성에 실패했습니다.");
	}

	return summarizedContent;
};
