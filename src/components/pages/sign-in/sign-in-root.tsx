"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { useSignInWithPasswordMutation } from "@/hooks/mutations/auth";

const SignInRoot = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { mutate: signInWithPassword } = useSignInWithPasswordMutation();
	const handleLogin = async (event: FormEvent) => {
		event.preventDefault();

		signInWithPassword(
			{ email, password },
			{
				onSuccess: ({ user }) => {
					if (user.id) {
						location.replace("/");
					}
				},
				onError: () => {
					toast.error("로그인에 실패했습니다.", {
						position: "top-center",
					});
				},
			},
		);
	};

	return (
		<div style={{ padding: "2rem" }}>
			<h1>Admin Login</h1>
			<form onSubmit={handleLogin}>
				<div>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						required
					/>
				</div>
				<div>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						required
					/>
				</div>
				<button type="submit">Login</button>
			</form>
		</div>
	);
};

export default SignInRoot;
