"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import Loader from "@/components/ui/loader";
import { useGetUser } from "@/hooks/queries/auth";
import { ROUTES } from "@/lib/constant/routes";

interface INoAuthGuardProps {
	children: ReactNode;
}

const NoAuthGuard = ({ children }: INoAuthGuardProps) => {
	const { data, isPending } = useGetUser();
	const { replace } = useRouter();

	useEffect(() => {
		if (isPending) return;
		if (data?.user?.id) {
			replace(ROUTES.HOME);
		}
	}, [data?.user?.id, isPending, replace]);

	if (isPending) return <Loader />;
	return children;
};

export default NoAuthGuard;
