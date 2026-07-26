// lib/editor.ts
export function normalizeEditorContent(content: string | undefined | null) {
  if (!content) {
    return "";
  }

  // DOMParser is only available in the browser.
  // During SSR, assume existing content is already HTML.
  if (typeof window === "undefined") {
    return content;
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
