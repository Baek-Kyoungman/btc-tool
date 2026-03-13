import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "../actions";
import { ArrowLeft, ArrowRight, Calendar, Heart, Eye, Pencil } from "lucide-react";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const isUuid = UUID_REGEX.test(slug);
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .match(isUuid ? { id: slug } : { slug })
    .single();

  if (error || !post) {
    notFound();
  }

  const { data: prevPost } = await supabase
    .from("posts")
    .select("id, title")
    .gt("published_at", post.published_at)
    .order("published_at", { ascending: true })
    .limit(1)
    .single();

  const { data: nextPost } = await supabase
    .from("posts")
    .select("id, title")
    .lt("published_at", post.published_at)
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  const isAdmin = await verifyAdmin();

  return (
    <div className="notion-style">
      {/* 상단 네비게이션 */}
      <nav className="mb-10 flex items-center justify-between">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[#37352f99] transition-colors hover:text-[#37352f] dark:text-[#ebebeb99] dark:hover:text-[#ebebeb]"
        >
          <ArrowLeft className="h-4 w-4" />
          블로그 목록
        </Link>
        {isAdmin && (
          <Link
            href={`/blog/${post.id}/edit`}
            className="inline-flex items-center gap-2 rounded-md border border-[rgba(55,53,47,0.2)] px-3 py-1.5 text-sm text-[#37352f] transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:hover:bg-[rgba(255,255,255,0.04)]"
          >
            <Pencil className="h-4 w-4" />
            게시글 수정하기
          </Link>
        )}
      </nav>

      <article className="overflow-hidden rounded-2xl border border-transparent bg-[#ffffff] dark:border-transparent dark:bg-[#191919]">
        {/* 썸네일 히어로 */}
        {post.thumbnail && (
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-[rgba(55,53,47,0.06)] dark:bg-[rgba(255,255,255,0.06)]">
            <Image
              src={post.thumbnail}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 900px"
              priority
            />
          </div>
        )}

        <div className="p-8 sm:p-10">
          {/* 메타 정보 */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-[#37352f99] dark:text-[#ebebeb99]">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden />
              <time dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" aria-hidden />
              {post.likes ?? 0}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" aria-hidden />
              {post.views ?? 0}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="mb-4 text-[2rem] font-bold leading-tight tracking-tight text-[#37352f] dark:text-[#ebebeb] sm:text-[2.5rem]">
            {post.title}
          </h1>

          {/* 요약 */}
          {post.excerpt && (
            <p className="mb-8 text-lg leading-relaxed text-[#37352f99] dark:text-[#ebebeb99]">
              {post.excerpt}
            </p>
          )}

          {/* 본문 구분선 */}
          <hr className="mb-8 border-transparent dark:border-transparent" />

          {/* 본문 */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </div>
      </article>

      {/* 이전글 / 다음글 / 목록 */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.id}`}
              className="group flex items-center gap-2 rounded-xl border border-transparent bg-transparent px-4 py-3 text-left text-sm transition-all hover:border-amber-500/40 hover:shadow-md dark:border-transparent dark:hover:border-amber-400/40"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
              <div className="min-w-0">
                <span className="block text-xs text-[#37352f99] dark:text-[#ebebeb99]">
                  이전글
                </span>
                <span className="line-clamp-1 font-medium text-[#37352f] dark:text-[#ebebeb]">
                  {prevPost.title}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
        <Link
          href="/blog"
          className="order-first shrink-0 text-center text-sm text-[#37352f99] transition-colors hover:text-[#37352f] dark:text-[#ebebeb99] dark:hover:text-[#ebebeb] sm:order-none"
        >
          목록
        </Link>
        <div className="flex flex-1 justify-end">
          {nextPost ? (
            <Link
              href={`/blog/${nextPost.id}`}
              className="group flex max-w-full items-center gap-2 rounded-xl border border-transparent bg-transparent px-4 py-3 text-right text-sm transition-all hover:border-amber-500/40 hover:shadow-md dark:border-transparent dark:hover:border-amber-400/40 sm:max-w-[50%]"
            >
              <div className="min-w-0 flex-1">
                <span className="block text-xs text-[#37352f99] dark:text-[#ebebeb99]">
                  다음글
                </span>
                <span className="line-clamp-1 font-medium text-[#37352f] dark:text-[#ebebeb]">
                  {nextPost.title}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
