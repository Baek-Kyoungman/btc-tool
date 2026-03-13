"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Minus,
  ImagePlus,
} from "lucide-react";

interface TiptapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
}

interface EditorToolbarProps {
  editor: ReturnType<typeof useEditor>;
  editable: boolean;
  onImageUpload?: (file: File) => Promise<string>;
}

function EditorToolbar({
  editor,
  editable,
  onImageUpload,
}: EditorToolbarProps) {
  if (!editor || !editable) return null;

  const Button = ({
    onClick,
    active,
    disabled,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded transition-colors",
        active
          ? "bg-[rgba(55,53,47,0.12)] text-[#37352f] dark:bg-[rgba(255,255,255,0.12)] dark:text-[#ebebeb]"
          : "text-[#37352f99] hover:bg-[rgba(55,53,47,0.06)] hover:text-[#37352f] dark:text-[#ebebeb99] dark:hover:bg-[rgba(255,255,255,0.06)] dark:hover:text-[#ebebeb]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-[rgba(55,53,47,0.09)] px-2 py-1.5 dark:border-[rgba(255,255,255,0.09)]">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="굵게"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="기울임"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="취소선"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <div className="mx-1 h-4 w-px bg-[rgba(55,53,47,0.2)] dark:bg-[rgba(255,255,255,0.2)]" />
      <Button
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        active={editor.isActive("heading", { level: 1 })}
        title="제목 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        active={editor.isActive("heading", { level: 2 })}
        title="제목 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <div className="mx-1 h-4 w-px bg-[rgba(55,53,47,0.2)] dark:bg-[rgba(255,255,255,0.2)]" />
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="글머리 기호"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="번호 목록"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="인용"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="코드 블록"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="구분선"
      >
        <Minus className="h-4 w-4" />
      </Button>
      {onImageUpload && (
        <>
          <div className="mx-1 h-4 w-px bg-[rgba(55,53,47,0.2)] dark:bg-[rgba(255,255,255,0.2)]" />
          <label
            title="이미지 삽입"
            className={cn(
              "flex h-8 w-8 cursor-pointer items-center justify-center rounded transition-colors",
              "text-[#37352f99] hover:bg-[rgba(55,53,47,0.06)] hover:text-[#37352f] dark:text-[#ebebeb99] dark:hover:bg-[rgba(255,255,255,0.06)] dark:hover:text-[#ebebeb]"
            )}
          >
            <ImagePlus className="h-4 w-4" />
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await onImageUpload(file);
                  editor.chain().focus().setImage({ src: url }).run();
                } catch {
                  // 에러는 onImageUpload 내부에서 처리
                }
                e.target.value = "";
              }}
            />
          </label>
        </>
      )}
    </div>
  );
}

export function TiptapEditor({
  content = "",
  onChange,
  placeholder = "글을 작성하세요...",
  className,
  editable = true,
  onImageUpload,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-sm dark:prose-invert max-w-none min-h-[240px] px-4 py-4 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-[rgba(55,53,47,0.09)] bg-white dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1f1f1f]",
        editable && "focus-within:ring-2 focus-within:ring-amber-500/20",
        className
      )}
    >
      <EditorToolbar
        editor={editor}
        editable={editable}
        onImageUpload={onImageUpload}
      />
      <EditorContent editor={editor} />
    </div>
  );
}
