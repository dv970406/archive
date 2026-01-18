import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/query-keys";
import { usePostDraft } from "@/store/post/use-post-draft";
import { useUpdatePostMutation } from "../mutations/post";

export const usePublishPost = ({ type }: { type: "CREATE" | "UPDATE" }) => {
	const { category, content, title, thumbnail, id } = usePostDraft();

	const { replace } = useRouter();
	const { mutate: updatePost, isPending: isPublishPostPending } =
		useUpdatePostMutation();

	const queryClient = useQueryClient();

	const handlePublishPost = () => {
		if (!id) return;
		if (!category) {
			toast.error("카테고리를 선택해주세요.", {
				position: "top-center",
			});
			return;
		}
		if (title.trim() === "") {
			toast.error("제목을 입력해주세요.", {
				position: "top-center",
			});
			return;
		}
		if (isPublishPostPending) return;

		const now = new Date().toISOString();
		updatePost(
			{
				id,
				title,
				content,
				category_id: category.id,
				thumbnail,
				status: "PUBLISHED",
				updated_at: now,
				...(type === "CREATE" && {
					published_at: now,
				}),
			},
			{
				onSuccess: () => {
					toast.success("포스트 발행에 성공했습니다", {
						position: "top-center",
					});
					queryClient.resetQueries({
						queryKey: QUERY_KEYS.post.list(category.id),
					});

					replace("/");
				},
				onError: () => {
					toast.error("포스트 발행에 실패했습니다", {
						position: "top-center",
					});
				},
			},
		);
	};

	return {
		isPublishPostPending,
		handlePublishPost,
	};
};

export type IUsePublishPostReturn = ReturnType<typeof usePublishPost>;
