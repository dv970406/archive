import type { ReactNode } from "react";
import GlobalHeader from "@/components/layout/header/global-header";
import MainContent from "@/components/layout/main-content";

interface IWithHeaderLayoutProps {
	children: ReactNode;
}

const WithHeaderLayout = ({ children }: IWithHeaderLayoutProps) => {
	return (
		<>
			<GlobalHeader />
			<MainContent>{children}</MainContent>
		</>
	);
};

export default WithHeaderLayout;
