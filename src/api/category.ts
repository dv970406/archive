import { cache } from "react";
import supabaseClient from "@/lib/supabase/client";

// request memoization 차원에서 직접 cache 함수로 래핑
// app router에서 Next가 제공하는 fetch api를 사용한다면 여러 곳에서 요청을 보낸 경우 직접 cache함수로 감싸지 않아도 내부적으로 duplicate를 방지하고 캐시처리를 해줌.
// 지금 나는 fetch api가 아닌 supabase client를 통해 요청하므로 중복 요청방지를 위해서는 직접 cache함수 사용이 필요함.
// https://nextjs.org/docs/app/getting-started/fetching-data#deduplicate-requests-and-cache-data
// 물론 이 요청 함수는 tanstack-query의 쿼리함수로 쓰일거라 cache함수를 꼭 쓰지 않아도 되긴 함
// 서버측에서 prefetch되고 tanstack-query의 cache에 저장된 후에 사용될 것이기 때문
export const fetchAllCategories = cache(async () => {
  const { data, error } = await supabaseClient
    .from("category")
    .select("*")
    .order("order");

  if (error) throw error;

  return data;
});

export const fetchCategoryByPathname = cache(async (pathname: string) => {
  const { data, error } = await supabaseClient
    .from("category")
    .select("*")
    .eq("pathname", pathname)
    .single();

  if (error) throw error;

  return data;
});
