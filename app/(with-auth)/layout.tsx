import type { ReactNode } from "react";
import AuthGuard from "./auth-guard";

interface IWithAuthLayoutProps {
	children: ReactNode;
}

const WithAuthLayout = ({ children }: IWithAuthLayoutProps) => {
	return <AuthGuard>{children}</AuthGuard>;
};

export default WithAuthLayout;
