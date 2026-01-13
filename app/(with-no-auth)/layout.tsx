import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { fetchUser } from "@/api/auth";

interface IWithNoAuthLayoutProps {
	children: ReactNode;
}

const WithNoAuthLayout = async ({ children }: IWithNoAuthLayoutProps) => {
	const { user } = await fetchUser();
	if (user?.id) {
		redirect("/");
	}
	return (
		<main className="container mx-auto px-4 py-12 max-w-4xl">{children}</main>
	);
};

export default WithNoAuthLayout;
