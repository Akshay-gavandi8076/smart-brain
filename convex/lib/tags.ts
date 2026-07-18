import type { MutationCtx } from "../_generated/server";

export function parseTagString(tags?: string): string[] {
  if (!tags?.trim()) return [];
  return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
}

export function normalizeTagName(tag: string): string {
  return tag.trim().toLowerCase();
}

/** Upsert tags and increment usage count for each one. */
export async function syncTags(
  ctx: MutationCtx,
  userId: string,
  tagNames: string[],
): Promise<void> {
  for (const rawTag of tagNames) {
    const normalized = normalizeTagName(rawTag);
    if (!normalized) continue;

    const existing = await ctx.db
      .query("tags")
      .withIndex("by_user_normalized", (q) =>
        q.eq("tokenIdentifier", userId).eq("normalized", normalized),
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        usageCount: (existing.usageCount ?? 0) + 1,
      });
      continue;
    }

    await ctx.db.insert("tags", {
      name: rawTag.trim(),
      normalized,
      tokenIdentifier: userId,
      usageCount: 1,
    });
  }
}

/** Sync only tags that were added since the previous value. */
export async function syncAddedTags(
  ctx: MutationCtx,
  userId: string,
  previousTags: string[],
  nextTags: string[],
): Promise<void> {
  const previous = new Set(previousTags.map(normalizeTagName));
  const added = nextTags.filter(
    (tag) => !previous.has(normalizeTagName(tag)),
  );
  await syncTags(ctx, userId, added);
}
