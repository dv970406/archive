import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_API_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? ""
);

export default supabaseClient;
