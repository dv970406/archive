const colorSet = [
	{
		bg: "bg-indigo-500/10",
		border: "border-indigo-500/50",
		gradient: "from-indigo-600 to-indigo-800",
		category: "bg-indigo-600",
	},
	{
		bg: "bg-cyan-500/10",
		border: "border-cyan-500/50",
		gradient: "from-cyan-600 to-cyan-800",
		category: "bg-cyan-600",
	},
	{
		bg: "bg-purple-500/10",
		border: "border-purple-500/50",
		gradient: "from-purple-600 to-purple-800",
		category: "bg-purple-600",
	},
	{
		bg: "bg-emerald-500/10",
		border: "border-emerald-500/50",
		gradient: "from-emerald-600 to-emerald-800",
		category: "bg-emerald-600",
	},
	{
		bg: "bg-amber-500/10",
		border: "border-amber-500/50",
		gradient: "from-amber-600 to-amber-800",
		category: "bg-amber-600",
	},
	{
		bg: "bg-pink-500/10",
		border: "border-pink-500/50",
		gradient: "from-pink-600 to-pink-800",
		category: "bg-pink-600",
	},
	{
		bg: "bg-blue-500/10",
		border: "border-blue-500/50",
		gradient: "from-blue-600 to-blue-800",
		category: "bg-blue-600",
	},
	{
		bg: "bg-teal-500/10",
		border: "border-teal-500/50",
		gradient: "from-teal-600 to-teal-800",
		category: "bg-teal-600",
	},
	{
		bg: "bg-orange-500/10",
		border: "border-orange-500/50",
		gradient: "from-orange-600 to-orange-800",
		category: "bg-orange-600",
	},
	{
		bg: "bg-red-500/10",
		border: "border-red-500/50",
		gradient: "from-red-600 to-red-800",
		category: "bg-red-600",
	},
	{
		bg: "bg-violet-500/10",
		border: "border-violet-500/50",
		gradient: "from-violet-600 to-violet-800",
		category: "bg-violet-600",
	},
	{
		bg: "bg-sky-500/10",
		border: "border-sky-500/50",
		gradient: "from-sky-600 to-sky-800",
		category: "bg-sky-600",
	},
];

export const getCategoryColor = (categoryId: number) => {
	return colorSet[categoryId - 1];
};
