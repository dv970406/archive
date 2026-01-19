import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// 호출된 환경에 따라 다른 client를 사용
// server : supabaseServerClient
// browser : createBrowserClient
const supabaseClient = () => {
	// if (typeof window === "undefined") {
	// 	return supabaseServerClient();
	// }

	// SSR + CSR 동시대응 가능
	return createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_API_URL ?? "",
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? "",
	);
};

export default supabaseClient;
