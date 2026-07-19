"use client";

import { useEffect, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";

import { editorExtensions } from "./extensions";
import Toolbar from "./Toolbar";

import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;

  onChange?: (html: string) => void;

  editable?: boolean;

  placeholder?: string;

  className?: string;
}

function RichTextEditor({
  content,
  onChange,
  editable = true,
  className,
}: RichTextEditorProps) {
  const [, setEditorState] = useState(0);

  const editor = useEditor({
    extensions: editorExtensions,

    content: content ?? "",

    editable,

    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },

    onSelectionUpdate() {
      setEditorState((value) => value + 1);
    },

    onTransaction() {
      setEditorState((value) => value + 1);
    },

    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none min-h-[500px] outline-none px-8 py-6",
      },
    },

    immediatelyRender: false,
  });

  /*
    Sync external changes

    Example:
    - opening another note
    - loading from Convex
  */
  useEffect(() => {
    if (!editor) return;

    if (content && content !== editor.getHTML()) {
      editor.commands.setContent(content, {
        emitUpdate: false,
      });
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col rounded-xl border bg-background",
        className,
      )}
    >
      {editable && <Toolbar editor={editor} />}

      <div className="flex-1 overflow-y-auto bg-background">
        {/* <EditorContent editor={editor} /> */}
        <EditorContent
          editor={editor}
          className={cn(
            "prose min-h-[500px] max-w-none dark:prose-invert",
            "prose-headings:font-bold",
            "prose-h1:mb-4 prose-h1:mt-8 prose-h1:text-4xl",
            "prose-h2:mb-3 prose-h2:mt-6 prose-h2:text-3xl",
            "prose-h3:mb-2 prose-h3:mt-5 prose-h3:text-2xl",
            "prose-p:leading-8",
            "px-8 py-6 outline-none",
          )}
        />
      </div>
    </div>
  );
}

export default RichTextEditor;
