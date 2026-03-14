"use client";

import { useActionState, useState } from "react";
import { createPost, uploadImage } from "../actions";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { ThumbnailUpload } from "./thumbnail-upload";
import { ChevronDown } from "lucide-react";

async function handleImageUpload(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const result = await uploadImage(formData);
  if ("error" in result) throw new Error(result.error);
  return result.url;
}

export function BlogWriteForm() {
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [state, formAction] = useActionState(createPost, null);

  return (
    <form action={formAction} className="flex flex-col">
      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] bg-white dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1f1f1f]">
        <TiptapEditor
          content={content}
          onChange={setContent}
          placeholder="본문을 작성하세요..."
          onImageUpload={handleImageUpload}
          className="border-0"
          topContent={
            <div className="border-b border-[rgba(55,53,47,0.09)] px-4 pt-5 pb-5 dark:border-[rgba(255,255,255,0.09)]">
              <div>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="제목을 입력하세요"
                  className="w-full rounded border-0 bg-transparent px-0 py-2 text-2xl font-semibold leading-tight text-[#37352f] placeholder:text-[#37352f66] focus:outline-none focus:ring-0 dark:text-[#ebebeb] dark:placeholder:text-[#ebebeb66]"
                />
              </div>
            </div>
          }
          bottomContent={
            <div className="border-t border-[rgba(55,53,47,0.09)] px-4 py-4 dark:border-[rgba(255,255,255,0.09)]">
              <input
                type="text"
                name="tags"
                placeholder="#태그입력 (쉼표로 구분)"
                className="w-full rounded border-0 bg-transparent px-0 py-1.5 text-sm text-[#37352f99] placeholder:text-[#37352f66] focus:outline-none focus:ring-0 dark:text-[#ebebeb99] dark:placeholder:text-[#ebebeb66]"
              />
            </div>
          }
        />
      </div>
      <input type="hidden" name="content" value={content} readOnly />

      <div className="mt-6 space-y-4">
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-1 text-sm text-[#37352f99] hover:text-[#37352f] dark:text-[#ebebeb99] dark:hover:text-[#ebebeb]"
        >
          추가 옵션 (요약, URL, 썸네일)
          <ChevronDown className={`h-4 w-4 transition-transform ${showOptions ? "rotate-180" : ""}`} />
        </button>

        {showOptions && (
          <div className="space-y-4 rounded-lg border border-[rgba(55,53,47,0.09)] bg-[rgba(55,53,47,0.02)] p-4 dark:border-[rgba(255,255,255,0.09)] dark:bg-[rgba(255,255,255,0.02)]">
            <div>
              <label htmlFor="excerpt" className="mb-1.5 block text-sm font-medium text-[#37352f] dark:text-[#ebebeb]">
                요약 *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                required
                rows={3}
                placeholder="카드에 표시될 요약 (2~4줄)"
                className="w-full resize-none rounded-md border border-[rgba(55,53,47,0.2)] bg-transparent px-3 py-2 text-[#37352f] placeholder:text-[#37352f66] focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:placeholder:text-[#ebebeb66]"
              />
            </div>
            <div>
              <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-[#37352f] dark:text-[#ebebeb]">
                URL 슬러그 (선택)
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                placeholder="비워두면 제목에서 자동 생성"
                className="w-full rounded-md border border-[rgba(55,53,47,0.2)] bg-transparent px-3 py-2 text-[#37352f] placeholder:text-[#37352f66] focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:placeholder:text-[#ebebeb66]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#37352f] dark:text-[#ebebeb]">
                썸네일 (선택)
              </label>
              <ThumbnailUpload name="thumbnail" value={thumbnail} onChange={setThumbnail} />
            </div>
          </div>
        )}
      </div>

      {state && "error" in state && state.error && (
        <p className="mt-4 text-sm text-red-500">{state.error}</p>
      )}

      <button
        type="submit"
        className="mt-8 w-full rounded-md bg-amber-500 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-600"
      >
        게시하기
      </button>
    </form>
  );
}
