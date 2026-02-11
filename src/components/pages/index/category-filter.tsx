import Link from "next/link";
import { cachedAllCategories } from "@/api/category";

const CategoryFilter = async () => {
	const allCategories = await cachedAllCategories();

	return (
		<ul className="flex gap-2 flex-wrap mb-8">
			{allCategories?.map((category) => (
				<li key={category.id}>
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
