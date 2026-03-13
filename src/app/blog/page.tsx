import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { BlogPostCard, type BlogPost } from "@/components/blog/blog-post-card";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { PenSquare } from "lucide-react";

const POSTS_PER_PAGE = 6;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const pageParam = params?.page;
  const pageStr = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const supabase = await createClient();
  const { data: posts, error, count } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, thumbnail, published_at, likes, views", {
      count: "exact",
    })
    .order("published_at", { ascending: false })
    .range(from, to);

  const totalPosts = count ?? 0;
  const blogPosts: BlogPost[] =
    posts?.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      thumbnail: p.thumbnail,
      publishedAt: p.published_at,
      likes: p.likes ?? 0,
      views: p.views ?? 0,
    })) ?? [];

  return (
    <div className="notion-style">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between md:mb-12">
        <div>
          <h1 className="mb-2 text-xl font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-2xl md:text-[2.5rem]">
            블로그
          </h1>
          <p className="text-[1rem] leading-7 text-[#37352f99] dark:text-[#ebebeb99]">
            비트코인 관련 아티클
          </p>
        </div>
        <Link
          href="/blog/write"
          className="flex shrink-0 items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
        >
          <PenSquare className="h-4 w-4" />
          글쓰기
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          게시글을 불러올 수 없습니다. Supabase 연결 및 posts 테이블 생성 여부를
          확인하세요.
        </div>
      )}

      {!error && blogPosts.length === 0 && (
        <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-12 text-center dark:border-[rgba(255,255,255,0.09)]">
          <p className="mb-4 text-[#37352f99] dark:text-[#ebebeb99]">
            아직 등록된 게시글이 없습니다.
          </p>
          <Link
            href="/blog/write"
            className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            <PenSquare className="h-4 w-4" />
            첫 글 작성하기
          </Link>
        </div>
      )}

      {blogPosts.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
          {totalPosts > POSTS_PER_PAGE && (
            <Suspense fallback={null}>
              <BlogPagination totalPosts={totalPosts} />
            </Suspense>
          )}
        </>
      )}
    </div>
  );
}
