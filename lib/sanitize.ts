import DOMPurify from "dompurify";

export function sanitizeHTML(html: string) {
  if (typeof window === "undefined") {
    return html;
  }

  return DOMPurify.sanitize(html);
}
