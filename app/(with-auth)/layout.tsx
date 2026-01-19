"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import Loader from "@/components/ui/loader";
import { useGetUser } from "@/hooks/queries/auth";

interface IWithAuthLayoutProps {
	children: ReactNode;
}

const WithAuthLayout = ({ children }: IWithAuthLayoutProps) => {
	const { data, isPending } = useGetUser();
	const { replace } = useRouter();

	useEffect(() => {
		if (isPending) return;
		if (!data?.user?.id) {
			replace("/sign-in");
		}
	}, [data?.user?.id, isPending, replace]);

	if (isPending) return <Loader />;
	return children;
};

export default WithAuthLayout;
