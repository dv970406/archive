"use client";

import { Box, List } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const PostsListTypeToggle = () => {
	const { replace } = useRouter();
	const pathname = usePathname();
	const is3D = pathname === "/3D";

	const handlePostsListType = () => {
		replace(is3D ? "/" : "/3D");
	};

	return (
		<button
			type="button"
			onClick={handlePostsListType}
			className={
				"flex items-center gap-1 rounded-full border border-border bg-muted/50 p-0.5 transition-colors"
			}
			aria-label={is3D ? "리스트 뷰로 전환" : "3D 뷰로 전환"}
		>
			<SwitchItem
				icon={<List className="w-3 h-3" />}
				text="리스트"
				isActive={!is3D}
			/>
			<SwitchItem
				icon={<Box className="w-3 h-3" />}
				text="3D"
				isActive={is3D}
			/>
		</button>
	);
};

interface ISwitchItem {
	isActive?: boolean;
	text: string;
	icon: ReactNode;
}
const SwitchItem = ({ isActive, icon, text }: ISwitchItem) => {
	return (
		<span
			className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
				isActive
					? "bg-primary text-primary-foreground shadow-sm"
					: "text-muted-foreground"
			}`}
		>
			{icon}
			<span className="hidden md:inline">{text}</span>
		</span>
	);
};

export default PostsListTypeToggle;
