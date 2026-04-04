"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import Loader from "@/components/ui/loader";
import { useGetUser } from "@/hooks/queries/auth";
import { ROUTES } from "@/lib/constant/routes";

interface IAuthGuardProps {
	children: ReactNode;
}

const AuthGuard = ({ children }: IAuthGuardProps) => {
	const { data, isPending } = useGetUser();
	const { replace } = useRouter();

	useEffect(() => {
		if (isPending) return;
		if (!data?.user?.id) {
			replace(ROUTES.SIGN_IN);
		}
	}, [data?.user?.id, isPending, replace]);

	if (isPending) return <Loader />;
	return children;
};

export default AuthGuard;
