import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { hasAccessToDocument } from "./documents";

export const getChatsForDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const accessObj = await hasAccessToDocument(ctx, args.documentId);
    if (!accessObj) return [];

    return await ctx.db
      .query("chats")
      .withIndex("by_documentId_tokenIdentifier", (q) =>
        q.eq("documentId", args.documentId).eq("tokenIdentifier", accessObj.userId),
      )
      .collect();
  },
});

export const createChatRecord = internalMutation({
  args: {
    documentId: v.id('documents'),
    text: v.string(),
    isHuman: v.boolean(),
    tokenIdentifier: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert('chats', {
      documentId: args.documentId,
      text: args.text,
      isHuman: args.isHuman,
      tokenIdentifier: args.tokenIdentifier,
    })
  },
})
