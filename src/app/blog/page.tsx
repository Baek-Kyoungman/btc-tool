import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BlogPostCard, type BlogPost } from "@/components/blog/blog-post-card";
import { PenSquare } from "lucide-react";

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, thumbnail, published_at, likes, views")
    .order("published_at", { ascending: false });

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
      <div className="mb-12 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-[2.5rem] font-bold text-[#37352f] dark:text-[#ebebeb]">
            블로그
          </h1>
          <p className="text-[1rem] leading-7 text-[#37352f99] dark:text-[#ebebeb99]">
            비트코인 관련 아티클 (Tiptap 에디터, Supabase 연동)
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
        <div className="grid gap-6 sm:grid-cols-2">
          {blogPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
