import {
	defaultShouldDehydrateQuery,
	QueryClient,
} from "@tanstack/react-query";
import { cache } from "react";

// cache 함수로 QueryClient의 재연산 방지
export const getQueryClient = cache(
	() =>
		new QueryClient({
			defaultOptions: {
				queries: {
					retry: 0,
					staleTime: 1000 * 60,
					refetchOnMount: false,
					refetchOnReconnect: false,
					refetchOnWindowFocus: false,
				},
				dehydrate: {
					// per default, only successful Queries are included,
					// this includes pending Queries as well
					shouldDehydrateQuery: (query) =>
						defaultShouldDehydrateQuery(query) ||
						query.state.status === "pending",
				},
			},
		}),
);
