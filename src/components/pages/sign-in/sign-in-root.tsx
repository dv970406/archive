"use client";

import { type FormEvent, useState } from "react";
import supabaseClient from "@/lib/supabase/client";

const SignInRoot = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (event: FormEvent) => {
		event.preventDefault();

		const supabase = await supabaseClient();
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw error;

		location.replace("/");
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
