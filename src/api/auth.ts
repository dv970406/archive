import supabaseClient from "@/lib/supabase/client";

export const fetchUser = async () => {
	const { data } = await supabaseClient.auth.getUser();

	return data;
};

export const signInWithPassword = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const { error, data } = await supabaseClient.auth.signInWithPassword({
		email,
		password,
	});

	if (error) throw error;

	return data;
};
