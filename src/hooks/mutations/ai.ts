import { useMutation } from "@tanstack/react-query";

// 다른 query, mutation 훅들과 달리 곧바로 DB 요청이 아닌 Route Handler로 요청을 보내는 훅
// ai summarizer함수는 서버에서만 호출되어야 하므로 Route Handler에서 summarizer함수를 대기시켜놓았다.
export const useGenerateSummarizeMutation = () => {
	return useMutation({
		mutationFn: async (content: string) => {
			const res = await fetch("/api/ai/summarize", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content }),
			});
			const summarizedContent = await res.json();

			return summarizedContent;
		},
	});
};
