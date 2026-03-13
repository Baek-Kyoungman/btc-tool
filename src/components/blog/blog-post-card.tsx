import Link from "next/link";
import Image from "next/image";
import { Heart, Eye } from "lucide-react";

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

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className="group flex gap-4 rounded-lg border border-[rgba(55,53,47,0.09)] p-4 transition-colors hover:border-[rgba(55,53,47,0.2)] hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.09)] dark:hover:border-[rgba(255,255,255,0.2)] dark:hover:bg-[rgba(255,255,255,0.04)]"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-3 text-xs text-[#37352f99] dark:text-[#ebebeb99]">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toISOString().slice(0, 10)}
          </time>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" aria-hidden />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            {post.views}
          </span>
        </div>
        <h2 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-[#37352f] transition-colors group-hover:text-amber-600 dark:text-[#ebebeb] sm:text-lg dark:group-hover:text-amber-400">
          {post.title}
        </h2>
        <p className="line-clamp-3 text-sm leading-relaxed text-[#37352f99] dark:text-[#ebebeb99]">
          {post.excerpt}
          <span className="ml-0.5">...</span>
        </p>
      </div>
      {post.thumbnail ? (
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-[rgba(55,53,47,0.06)] dark:bg-[rgba(255,255,255,0.06)] sm:h-32 sm:w-32">
          <Image
            src={post.thumbnail}
            alt=""
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="128px"
          />
        </div>
      ) : (
        <div className="h-28 w-28 shrink-0 rounded-lg bg-[rgba(55,53,47,0.06)] dark:bg-[rgba(255,255,255,0.06)] sm:h-32 sm:w-32" />
      )}
    </Link>
  );
}
