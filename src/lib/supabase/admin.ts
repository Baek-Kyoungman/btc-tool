import { createClient } from "@supabase/supabase-js";

/**
 * 서버 전용 Admin 클라이언트 (service_role 키)
 * 글쓰기 등 관리자 작업에만 사용. 클라이언트에 노출 금지.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. .env.local을 확인하세요."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey);
}
