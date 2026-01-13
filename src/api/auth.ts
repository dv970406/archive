import supabaseClient from "@/lib/supabase/client";

export const fetchUser = async () => {
	const supabase = await supabaseClient();
	const { data } = await supabase.auth.getUser();

	return data;
};

export const signInWithPassword = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	const supabase = await supabaseClient();
	const { error, data } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) throw error;

	return data;
};
