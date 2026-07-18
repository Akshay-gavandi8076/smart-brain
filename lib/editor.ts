// lib/editor.ts

export function normalizeEditorContent(content: string | undefined | null) {
  if (!content) {
    return "";
  }

  const parser = new DOMParser();

  const document = parser.parseFromString(content, "text/html");

  const hasHTML = document.body.children.length > 0;

  if (hasHTML) {
    return content;
  }

  return content
    .split("\n")
    .map((line) => `<p>${escapeHTML(line)}</p>`)
    .join("");
}

function escapeHTML(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// // lib/editor.ts

// export function normalizeEditorContent(content: string | undefined | null) {
//   if (!content) {
//     return "";
//   }

//   // Already Tiptap HTML
//   if (content.trim().startsWith("<") && content.includes(">")) {
//     return content;
//   }

//   // Convert old plain text notes
//   return content
//     .split("\n")
//     .map((line) => `<p>${escapeHTML(line)}</p>`)
//     .join("");
// }

// function escapeHTML(value: string) {
//   return value
//     .replaceAll("&", "&amp;")
//     .replaceAll("<", "&lt;")
//     .replaceAll(">", "&gt;")
//     .replaceAll('"', "&quot;")
//     .replaceAll("'", "&#039;");
// }
