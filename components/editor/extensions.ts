import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { Typography } from "@tiptap/extension-typography";

export const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },

    bulletList: {
      HTMLAttributes: {
        class: "list-disc ml-6",
      },
    },

    orderedList: {
      HTMLAttributes: {
        class: "list-decimal ml-6",
      },
    },

    blockquote: {
      HTMLAttributes: {
        class:
          "border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground",
      },
    },

    codeBlock: {
      HTMLAttributes: {
        class: "rounded-lg bg-zinc-900 p-4 font-mono text-sm text-zinc-100",
      },
    },
  }),

  Placeholder.configure({
    placeholder: "Type '/' for commands...",
    emptyEditorClass:
      "before:pointer-events-none before:text-muted-foreground before:content-[attr(data-placeholder)]",
  }),

  Underline,

  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-blue-500 underline",
    },
  }),

  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),

  Highlight.configure({
    multicolor: true,
  }),

  TaskList.configure({
    HTMLAttributes: {
      class: "not-prose pl-0",
    },
  }),

  TaskItem.configure({
    nested: true,
  }),

  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "border-collapse table-auto w-full",
    },
  }),

  TableRow,

  TableHeader,

  TableCell,

  Dropcursor,

  Gapcursor,

  Typography,
];
