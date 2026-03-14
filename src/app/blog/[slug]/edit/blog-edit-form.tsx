"use client";

import { useActionState, useState } from "react";
import { updatePost, uploadImage } from "../../actions";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { ThumbnailUpload } from "../../write/thumbnail-upload";

async function handleImageUpload(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const result = await uploadImage(formData);
  if ("error" in result) throw new Error(result.error);
  return result.url;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string | null;
  tags?: string | null;
}

export function BlogEditForm({ post }: { post: Post }) {
  const [content, setContent] = useState(post.content);
  const [thumbnail, setThumbnail] = useState(post.thumbnail || "");
  const [state, formAction] = useActionState(updatePost, null);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={post.id} readOnly />

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-[#37352f] dark:text-[#ebebeb]"
        >
          제목 *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={post.title}
          placeholder="게시글 제목"
          className="w-full rounded-md border border-[rgba(55,53,47,0.2)] bg-transparent px-3 py-2 text-[#37352f] placeholder:text-[#37352f66] focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:placeholder:text-[#ebebeb66]"
        />
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="mb-2 block text-sm font-medium text-[#37352f] dark:text-[#ebebeb]"
        >
          요약 *
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={3}
          defaultValue={post.excerpt}
          placeholder="카드에 표시될 요약 (2~4줄)"
          className="w-full resize-none rounded-md border border-[rgba(55,53,47,0.2)] bg-transparent px-3 py-2 text-[#37352f] placeholder:text-[#37352f66] focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:placeholder:text-[#ebebeb66]"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="mb-2 block text-sm font-medium text-[#37352f] dark:text-[#ebebeb]"
        >
          URL 슬러그 (선택)
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          defaultValue={post.slug}
          placeholder="비워두면 제목에서 자동 생성"
          className="w-full rounded-md border border-[rgba(55,53,47,0.2)] bg-transparent px-3 py-2 text-[#37352f] placeholder:text-[#37352f66] focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:placeholder:text-[#ebebeb66]"
        />
      </div>

      <div>
        <label
          htmlFor="tags"
          className="mb-2 block text-sm font-medium text-[#37352f] dark:text-[#ebebeb]"
        >
          태그 (선택)
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          defaultValue={post.tags ?? ""}
          placeholder="#태그입력 (쉼표로 구분)"
          className="w-full rounded-md border border-[rgba(55,53,47,0.2)] bg-transparent px-3 py-2 text-[#37352f] placeholder:text-[#37352f66] focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:placeholder:text-[#ebebeb66]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#37352f] dark:text-[#ebebeb]">
          썸네일 (선택)
        </label>
        <ThumbnailUpload
          name="thumbnail"
          value={thumbnail}
          onChange={setThumbnail}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#37352f] dark:text-[#ebebeb]">
          본문 *
        </label>
        <TiptapEditor
          content={content}
          onChange={setContent}
          placeholder="본문을 작성하세요..."
          onImageUpload={handleImageUpload}
        />
        <input type="hidden" name="content" value={content} readOnly />
      </div>

      {state && "error" in state && state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <button
        type="submit"
        className="w-fit rounded-md bg-amber-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-amber-600"
      >
        수정 완료
      </button>
    </form>
  );
}
