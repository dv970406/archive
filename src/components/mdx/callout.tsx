import { cn } from "@/lib/style/tailwind";

interface CalloutProps {
	type?: "info" | "warning" | "success" | "error";
	children: React.ReactNode;
}

const styles = {
	info: "bg-blue-50 border-blue-500 text-blue-900 dark:bg-blue-950 dark:text-blue-100",
	warning:
		"bg-yellow-50 border-yellow-500 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100",
	success:
		"bg-green-50 border-green-500 text-green-900 dark:bg-green-950 dark:text-green-100",
	error:
		"bg-red-50 border-red-500 text-red-900 dark:bg-red-950 dark:text-red-100",
};
const Callout = ({ children, type = "info" }: CalloutProps) => {
	return (
		<div className={cn(`border-l-4 p-4 my-6 rounded`, styles[type])}>
			{children}
		</div>
	);
};

export default Callout;
