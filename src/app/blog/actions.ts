"use server";

import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

const ADMIN_COOKIE = "blog_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7일
const BUCKET = "blog-images";

function getAdminSecret() {
  const secret = process.env.BLOG_ADMIN_SECRET;
  if (!secret) {
    throw new Error("BLOG_ADMIN_SECRET가 설정되지 않았습니다.");
  }
  return secret;
}

export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE);
  return cookie?.value === "1";
}

export async function adminLogin(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const password = formData.get("password") as string | null;
  if (!password) {
    return { error: "비밀번호를 입력하세요." };
  }
  const secret = getAdminSecret();
  if (password !== secret) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  redirect("/blog/write");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/blog");
}

export async function uploadImage(formData: FormData): Promise<
  | { error: string }
  | { url: string }
> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { error: "관리자 권한이 필요합니다." };
  }

  const file = formData.get("file") as File | null;
  if (!file || !file.size) {
    return { error: "파일을 선택하세요." };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "JPEG, PNG, GIF, WebP만 업로드할 수 있습니다." };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { error: "파일 크기는 5MB 이하여야 합니다." };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    if (error.message?.toLowerCase().includes("bucket not found")) {
      return {
        error:
          "blog-images 버킷이 없습니다. Supabase 대시보드 > Storage > New bucket에서 생성하거나 docs/create-blog-images-bucket.sql을 실행하세요.",
      };
    }
    return { error: error.message };
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return { url: urlData.publicUrl };
}

export async function createPost(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { error: "관리자 권한이 필요합니다." };
  }

  const title = formData.get("title") as string | null;
  const excerpt = formData.get("excerpt") as string | null;
  const content = formData.get("content") as string | null;
  const slug = formData.get("slug") as string | null;
  const thumbnail = (formData.get("thumbnail") as string | null) || null;

  if (!title?.trim()) return { error: "제목을 입력하세요." };
  if (!excerpt?.trim()) return { error: "요약을 입력하세요." };
  if (!content?.trim()) return { error: "본문을 입력하세요." };

  const finalSlug =
    slug?.trim() ||
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w가-힣-]/g, "");

  if (!finalSlug) return { error: "유효한 slug를 생성할 수 없습니다." };

  const supabase = createAdminClient();
  const { data: newPost, error } = await supabase
    .from("posts")
    .insert({
      slug: finalSlug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      thumbnail: thumbnail || null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "이미 사용 중인 slug입니다. 다른 slug를 사용하세요." };
    }
    return { error: error.message };
  }

  redirect(newPost ? `/blog/${newPost.id}` : `/blog`);
}

export async function updatePost(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { error: "관리자 권한이 필요합니다." };
  }

  const id = formData.get("id") as string | null;
  if (!id?.trim()) return { error: "게시글 ID가 필요합니다." };

  const title = formData.get("title") as string | null;
  const excerpt = formData.get("excerpt") as string | null;
  const content = formData.get("content") as string | null;
  const slug = formData.get("slug") as string | null;
  const thumbnail = (formData.get("thumbnail") as string | null) || null;

  if (!title?.trim()) return { error: "제목을 입력하세요." };
  if (!excerpt?.trim()) return { error: "요약을 입력하세요." };
  if (!content?.trim()) return { error: "본문을 입력하세요." };

  const finalSlug =
    slug?.trim() ||
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w가-힣-]/g, "");

  if (!finalSlug) return { error: "유효한 slug를 생성할 수 없습니다." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("posts")
    .update({
      slug: finalSlug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      thumbnail: thumbnail || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "이미 사용 중인 slug입니다. 다른 slug를 사용하세요." };
    }
    return { error: error.message };
  }

  redirect(`/blog/${id}`);
}
