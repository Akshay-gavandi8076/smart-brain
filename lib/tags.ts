/** Parse a comma-separated tag string into individual tags. */
export function parseTags(tags?: string): string[] {
  if (!tags?.trim()) return [];
  return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
}

/** Serialize tags for storage in notes/documents. */
export function formatTags(tags: string[]): string {
  return tags.join(",");
}
