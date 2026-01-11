import type { ReactNode } from "react";
import GlobalHeader from "@/components/layout/header/global-header";

interface IPostWithHeaderLayoutProps {
	children: ReactNode;
}

const PostWithHeaderLayout = ({ children }: IPostWithHeaderLayoutProps) => {
	return (
		<>
			<GlobalHeader />
			{children}
		</>
	);
};

export default PostWithHeaderLayout;
