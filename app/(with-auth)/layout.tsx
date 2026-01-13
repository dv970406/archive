import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { fetchUser } from "@/api/auth";

interface IWithAuthLayoutProps {
	children: ReactNode;
}

const WithAuthLayout = async ({ children }: IWithAuthLayoutProps) => {
	const { user } = await fetchUser();
	if (!user?.id) {
		redirect("/sign-in");
	}
	return children;
};

export default WithAuthLayout;
