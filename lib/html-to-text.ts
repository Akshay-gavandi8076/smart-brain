export function htmlToText(html: string) {
  if (!html) return "";

  if (typeof window !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;

    return div.textContent || div.innerText || "";
  }

  return html.replace(/<[^>]+>/g, "");
}
