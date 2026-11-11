import Link from "next/link";
import { getAllCategories } from "@/lib/content/categories";

const CategoryFilter = () => {
	const allCategories = getAllCategories();

	return (
		<ul className="flex gap-2 flex-wrap mb-8">
			{allCategories.map((category) => (
				<li key={category.pathname}>
					<Link
						href={`/category/${category.pathname}`}
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
