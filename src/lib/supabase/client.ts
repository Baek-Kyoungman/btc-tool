import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase URL과 Anon Key가 설정되지 않았습니다. .env.local을 확인하세요."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
