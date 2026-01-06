"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode, useState } from "react";
import { getQueryClient } from "@/lib/utils";

const RTKProvider = ({ children }: { children: ReactNode }) => {
	const [queryClient] = useState(() => getQueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
		</QueryClientProvider>
	);
};

export default RTKProvider;
