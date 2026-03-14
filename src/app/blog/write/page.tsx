import { verifyAdmin } from "../actions";
import { AdminLoginForm } from "./admin-login-form";
import { BlogWriteForm } from "./blog-write-form";
import { LogoutButton } from "./logout-button";
import Link from "next/link";

export default async function BlogWritePage() {
  const isAdmin = await verifyAdmin();

  if (!isAdmin) {
    return (
      <div className="notion-style">
        <h1 className="mb-6 text-[2rem] font-bold text-[#37352f] dark:text-[#ebebeb]">
          관리자 로그인
        </h1>
        <p className="mb-6 text-[#37352f99] dark:text-[#ebebeb99]">
          글쓰기 페이지에 접근하려면 비밀번호를 입력하세요.
        </p>
        <AdminLoginForm />
      </div>
    );
  }

  return (
    <div className="notion-style">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-2xl">
          새 글 작성
        </h1>
        <div className="flex gap-2">
          <Link
            href="/blog"
            className="rounded-md border border-[rgba(55,53,47,0.2)] px-3 py-2 text-sm text-[#37352f] transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:hover:bg-[rgba(255,255,255,0.04)]"
          >
            목록
          </Link>
          <LogoutButton />
        </div>
      </div>
      <BlogWriteForm />
    </div>
  );
}
