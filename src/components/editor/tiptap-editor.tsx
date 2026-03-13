"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export function TiptapEditor({
  content = "",
  onChange,
  placeholder = "글을 작성하세요...",
  className,
  editable = true,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-[rgba(55,53,47,0.09)] dark:border-[rgba(255,255,255,0.09)]",
        editable && "focus-within:ring-2 focus-within:ring-amber-500/20",
        className
      )}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
