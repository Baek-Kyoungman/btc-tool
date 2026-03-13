"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const POSTS_PER_PAGE = 6;

interface BlogPaginationProps {
  totalPosts: number;
}

export function BlogPagination({ totalPosts }: BlogPaginationProps) {
  const searchParams = useSearchParams();
  const currentPage = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  if (totalPages <= 1) return null;

  const basePath = "/blog";

  function pageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={pageUrl(currentPage - 1)}
          className="mr-2 flex items-center gap-1 rounded-md px-3 py-2 text-sm text-[#37352f99] transition-colors hover:bg-[rgba(55,53,47,0.04)] hover:text-[#37352f] dark:text-[#ebebeb99] dark:hover:bg-[rgba(255,255,255,0.04)] dark:hover:text-[#ebebeb]"
        >
          &lt; 이전
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={pageUrl(page)}
          className={`flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors ${
            page === currentPage
              ? "border border-[rgba(55,53,47,0.2)] bg-[rgba(55,53,47,0.06)] text-[#37352f] dark:border-[rgba(255,255,255,0.2)] dark:bg-[rgba(255,255,255,0.06)] dark:text-[#ebebeb]"
              : "text-[#37352f99] hover:bg-[rgba(55,53,47,0.04)] hover:text-[#37352f] dark:text-[#ebebeb99] dark:hover:bg-[rgba(255,255,255,0.04)] dark:hover:text-[#ebebeb]"
          }`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={pageUrl(currentPage + 1)}
          className="ml-2 flex items-center gap-1 rounded-md px-3 py-2 text-sm text-[#37352f99] transition-colors hover:bg-[rgba(55,53,47,0.04)] hover:text-[#37352f] dark:text-[#ebebeb99] dark:hover:bg-[rgba(255,255,255,0.04)] dark:hover:text-[#ebebeb]"
        >
          다음 &gt;
        </Link>
      )}
    </div>
  );
}
