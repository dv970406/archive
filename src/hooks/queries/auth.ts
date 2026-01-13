import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/api/auth";
import { QUERY_KEYS } from "@/lib/query-keys";

export const useGetUser = () => {
	return useQuery({
		queryKey: QUERY_KEYS.auth.user,
		queryFn: fetchUser,
	});
};
