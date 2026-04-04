import type { ReactNode } from "react";
import MainContent from "@/components/layout/main-content";
import NoAuthGuard from "./no-auth-guard";

interface IWithNoAuthLayoutProps {
	children: ReactNode;
}

const WithNoAuthLayout = ({ children }: IWithNoAuthLayoutProps) => {
	return (
		<NoAuthGuard>
			<MainContent>{children}</MainContent>
		</NoAuthGuard>
	);
};

export default WithNoAuthLayout;
