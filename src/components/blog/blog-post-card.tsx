import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, FileText } from "lucide-react";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail?: string | null;
  publishedAt: string;
  likes: number;
  views: number;
}

interface BlogPostCardProps {
  post: BlogPost;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[rgba(55,53,47,0.2)] bg-white transition-colors hover:border-amber-500/50 dark:border-[rgba(255,255,255,0.2)] dark:bg-[#252525] dark:hover:border-amber-500/50"
    >
      {post.thumbnail ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[rgba(55,53,47,0.04)] dark:bg-[rgba(255,255,255,0.04)]">
          <Image
            src={post.thumbnail}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-[rgba(55,53,47,0.04)] dark:bg-[rgba(255,255,255,0.04)]">
          <FileText className="h-12 w-12 text-[#37352f33] dark:text-[#ebebeb33]" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3 text-xs text-[#37352f99] dark:text-[#ebebeb99]">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" aria-hidden />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            {post.views}
          </span>
        </div>
        <h2 className="mb-2 line-clamp-2 text-lg font-semibold leading-snug text-[#37352f] transition-colors group-hover:text-amber-600 dark:text-[#ebebeb] dark:group-hover:text-amber-400">
          {post.title}
        </h2>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-[#37352f99] dark:text-[#ebebeb99]">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
