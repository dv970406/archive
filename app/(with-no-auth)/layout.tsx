"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import Loader from "@/components/ui/loader";
import { useGetUser } from "@/hooks/queries/auth";

interface IWithNoAuthLayoutProps {
	children: ReactNode;
}

const WithNoAuthLayout = ({ children }: IWithNoAuthLayoutProps) => {
	const { data, isPending } = useGetUser();
	const { replace } = useRouter();

	useEffect(() => {
		if (isPending) return;
		if (data?.user?.id) {
			replace("/");
		}
	}, [data?.user?.id, isPending, replace]);

	if (isPending) return <Loader />;
	return (
		<main className="container mx-auto px-4 py-12 max-w-4xl">{children}</main>
	);
};

export default WithNoAuthLayout;
