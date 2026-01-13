import { useMutation } from "@tanstack/react-query";
import { signInWithPassword } from "@/api/auth";

export const useSignInWithPasswordMutation = () => {
	return useMutation({
		mutationFn: signInWithPassword,
	});
};
