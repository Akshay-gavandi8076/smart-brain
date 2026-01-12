import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

/** Get all tags for current user (used for suggestions) */
export const getTags = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return [];

    return await ctx.db
      .query("tags")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
      .order("desc")
      .collect();
  },
});

/** Add or increment tag usage */
export const addOrIncrementTag = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("Unauthorized");

    const normalized = args.name.trim().toLowerCase();
    if (!normalized) throw new ConvexError("Invalid tag");

    const existing = await ctx.db
      .query("tags")
      .withIndex("by_normalized", (q) =>
        q.eq("normalized", normalized).eq("tokenIdentifier", userId),
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        usageCount: (existing.usageCount ?? 0) + 1,
      });
      return existing._id;
    }

    return await ctx.db.insert("tags", {
      name: args.name.trim(),
      normalized,
      tokenIdentifier: userId,
      usageCount: 1,
    });
  },
});
