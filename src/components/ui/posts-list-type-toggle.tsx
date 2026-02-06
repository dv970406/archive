"use client";

import { Box, List } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PostsListTypeToggle = () => {
	const { replace } = useRouter();
	const pathname = usePathname();
	const handlePostsListType = () => {
		if (pathname === "/3D") {
			replace("/");
			return;
		}
		replace("/3D");
	};
	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={handlePostsListType}
			className="rounded-lg"
			aria-label="테마 전환"
		>
			{pathname !== "/3D" && <Box className="h-5 w-5" />}
			{pathname === "/3D" && <List className="h-5 w-5" />}
		</Button>
	);
};

export default PostsListTypeToggle;
