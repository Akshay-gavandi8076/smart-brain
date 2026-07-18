import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserId, requireUserId } from "./lib/auth";
import { normalizeTagName, syncTags } from "./lib/tags";

export const getTags = query({
  async handler(ctx) {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("tags")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
      .order("desc")
      .collect();
  },
});

export const addOrIncrementTag = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    const userId = await requireUserId(ctx);
    const normalized = normalizeTagName(args.name);
    if (!normalized) throw new ConvexError("Invalid tag");

    await syncTags(ctx, userId, [args.name]);
  },
});
