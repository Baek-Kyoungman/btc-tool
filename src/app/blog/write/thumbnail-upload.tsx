"use client";

import { useRef, useState } from "react";
import { uploadImage } from "../actions";
import { ImagePlus, X } from "lucide-react";

interface ThumbnailUploadProps {
  value: string;
  onChange: (url: string) => void;
  name: string;
}

export function ThumbnailUpload({ value, onChange, name }: ThumbnailUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);

    if ("error" in result) {
      setError(result.error);
    } else {
      onChange(result.url);
    }
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {value ? (
          <div className="relative inline-block">
            <img
              src={value}
              alt="썸네일 미리보기"
              className="h-32 w-48 rounded-lg border border-[rgba(55,53,47,0.09)] object-cover dark:border-[rgba(255,255,255,0.09)]"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
              title="제거"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-32 w-48 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[rgba(55,53,47,0.2)] transition-colors hover:border-amber-500/50 hover:bg-[rgba(55,53,47,0.02)] dark:border-[rgba(255,255,255,0.2)] dark:hover:border-amber-400/50 dark:hover:bg-[rgba(255,255,255,0.02)]"
          >
            <ImagePlus className="h-8 w-8 text-[#37352f66] dark:text-[#ebebeb66]" />
            <span className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
              {uploading ? "업로드 중..." : "이미지 선택"}
            </span>
          </button>
        )}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          {!value && (
            <p className="text-xs text-[#37352f99] dark:text-[#ebebeb99]">
              JPEG, PNG, GIF, WebP (최대 5MB)
            </p>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <input type="hidden" name={name} value={value} readOnly />
    </div>
  );
}
