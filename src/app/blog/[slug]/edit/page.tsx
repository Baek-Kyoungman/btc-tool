import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "../../actions";
import { BlogEditForm } from "./blog-edit-form";
import Link from "next/link";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function BlogEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    redirect("/blog/write");
  }

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

  return (
    <div className="notion-style">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[2.5rem] font-bold text-[#37352f] dark:text-[#ebebeb]">
          게시글 수정
        </h1>
        <Link
          href={`/blog/${post.id}`}
          className="rounded-md border border-[rgba(55,53,47,0.2)] px-4 py-2 text-sm text-[#37352f] transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:hover:bg-[rgba(255,255,255,0.04)]"
        >
          취소
        </Link>
      </div>
      <BlogEditForm post={post} />
    </div>
  );
}
