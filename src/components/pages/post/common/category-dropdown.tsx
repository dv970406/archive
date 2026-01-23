import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAllCategories } from "@/hooks/queries/category";
import { usePostDraft, useSetCategory } from "@/store/post/use-post-draft";
import type { Post } from "@/types/post";

const CategoryDropdown = () => {
	const { data: allCategories } = useAllCategories();
	const setCategory = useSetCategory();
	const { category } = usePostDraft();

	const handleClickCategory = (category: Post["category"]) => () => {
		setCategory(category);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="w-24">
				<Button variant="outline">{category?.title ?? "카테고리 선택"}</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-28" align="start">
				{allCategories?.map((category) => (
					<DropdownMenuItem key={category.id} asChild>
						<button
							type="button"
							onClick={handleClickCategory(category)}
							className="w-full"
						>
							{category.title}
						</button>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default CategoryDropdown;
