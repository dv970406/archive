// 클라이언트에서 AI Route Handler로 요청을 보내는 API 함수
export const summarizeContent = async (content: string): Promise<string> => {
	const res = await fetch("/api/ai/summarize", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ content }),
	});

	if (!res.ok) {
		throw new Error("AI 요약 생성에 실패했습니다.");
	}

	const summarizedContent = await res.json();
	return summarizedContent;
};
