import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function BlogNotFound() {
  return (
    <div className="notion-style">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(55,53,47,0.08)] dark:bg-[rgba(255,255,255,0.08)]">
          <FileQuestion className="h-10 w-10 text-[#37352f99] dark:text-[#ebebeb99]" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-[#37352f] dark:text-[#ebebeb]">
          게시글을 찾을 수 없습니다
        </h1>
        <p className="mb-8 max-w-md text-[#37352f99] dark:text-[#ebebeb99]">
          요청하신 게시글이 삭제되었거나 주소가 변경되었을 수 있습니다.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-5 py-2.5 font-medium text-white transition-colors hover:bg-amber-600"
        >
          블로그 목록으로
        </Link>
      </div>
    </div>
  );
}
