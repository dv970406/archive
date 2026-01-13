import type { MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAllCategories } from "@/hooks/queries/category";
import type { Post } from "@/types/post";

interface ICategoryDropdown {
	selectedCategory: Post["category"] | null;
	onClick: (category: Post["category"]) => MouseEventHandler<HTMLButtonElement>;
}
const CategoryDropdown = ({ onClick, selectedCategory }: ICategoryDropdown) => {
	const { data: allCategories } = useAllCategories();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="w-24">
				<Button variant="outline">
					{selectedCategory?.title ?? "카테고리 선택"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-28" align="start">
				{allCategories?.map((category) => (
					<DropdownMenuItem key={category.id} asChild>
						<button
							type="button"
							onClick={onClick(category)}
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
