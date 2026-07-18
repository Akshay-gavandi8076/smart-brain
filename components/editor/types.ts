// components/editor/types.ts

import { Editor } from "@tiptap/react";

export interface RichTextEditorProps {
  /**
   * HTML content stored in database.
   */
  content: string;

  /**
   * Whether editor is editable.
   */
  editable?: boolean;

  /**
   * Fired whenever document changes.
   */
  onChange?: (html: string) => void;

  /**
   * Placeholder shown when document is empty.
   */
  placeholder?: string;

  /**
   * Extra classes for the wrapper.
   */
  className?: string;
}

export interface ToolbarProps {
  editor: Editor;
}
