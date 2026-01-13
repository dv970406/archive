"use client";

import Link from "next/link";
import { useAllCategories } from "@/hooks/queries/category";

const CategoryFilter = () => {
	const { data: allCategories } = useAllCategories();

	return (
		<ul className="flex gap-2 flex-wrap mb-8">
			{allCategories?.map((category) => (
				<li key={category.id}>
					<Link
						href={{
							query: {
								categoryId: category.id.toString(),
							},
						}}
						className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-md"
					>
						{category.title}
					</Link>
				</li>
			))}
		</ul>
	);
};

export default CategoryFilter;
