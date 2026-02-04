import { ConvexError, v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import OpenAI from "openai";
import { internal } from "./_generated/api";

/* ---------------------------------------------
   OpenAI setup (unchanged)
--------------------------------------------- */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ---------------------------------------------
   Helper: normalize comma-separated tags
   "React, ai , convex" → ["react", "ai", "convex"]
--------------------------------------------- */
function normalizeTags(tags?: string): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

/* ---------------------------------------------
   GET SINGLE NOTE
--------------------------------------------- */
export const getNote = query({
  args: {
    noteId: v.id("notes"),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return null;

    const note = await ctx.db.get(args.noteId);
    if (!note || note.tokenIdentifier !== userId) return null;

    const document = note.documentId ? await ctx.db.get(note.documentId) : null;

    return { ...note, document };
  },
});

/* ---------------------------------------------
   GET ALL NOTES (sorted by updatedAt)
--------------------------------------------- */
export const getNotes = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return null;

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
      .collect();

    notes.sort((a, b) => {
      const aTime = a.updatedAt ?? a._creationTime;
      const bTime = b.updatedAt ?? b._creationTime;
      return bTime - aTime;
    });

    return notes;
  },
});

/* ---------------------------------------------
   EMBEDDING HELPERS (unchanged)
--------------------------------------------- */
async function embed(text: string) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return embedding.data[0].embedding;
}

export const setNoteEmbedding = internalMutation({
  args: {
    noteId: v.id("notes"),
    embedding: v.array(v.number()),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.noteId, { embedding: args.embedding });
  },
});

export const createNoteEmbedding = internalAction({
  args: {
    noteId: v.id("notes"),
    title: v.string(),
    text: v.string(),
  },
  async handler(ctx, args) {
    const embedding = await embed(args.text);
    await ctx.runMutation(internal.notes.setNoteEmbedding, {
      noteId: args.noteId,
      embedding,
    });
  },
});

/* ---------------------------------------------
   CREATE NOTE
   - Inserts note
   - Creates tag suggestions ONCE
--------------------------------------------- */
export const createNote = mutation({
  args: {
    title: v.string(),
    text: v.string(),
    tags: v.optional(v.string()),
    documentId: v.optional(v.id("documents")),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("User not found");

    const normalizedTags = normalizeTags(args.tags);

    // Insert note
    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      text: args.text,
      tokenIdentifier: userId,
      tags: args.tags ?? "",
      documentId: args.documentId,
      updatedAt: Date.now(),
    });

    // Create tag suggestions (only if not already present)
    for (const tag of normalizedTags) {
      const existing = await ctx.db
        .query("tags")
        .withIndex("by_user_normalized", (q) =>
          q.eq("tokenIdentifier", userId).eq("normalized", tag),
        )
        .first();

      if (!existing) {
        await ctx.db.insert("tags", {
          name: tag,
          normalized: tag,
          tokenIdentifier: userId,
        });
      }
    }

    // Create embedding async
    await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbedding, {
      noteId,
      title: args.title,
      text: args.text,
    });
  },
});

/* ---------------------------------------------
   UPDATE NOTE  ✅ FIXED BUG HERE
   - Diff old tags vs new tags
   - Insert ONLY newly added tags
--------------------------------------------- */
export const updateNote = mutation({
  args: {
    noteId: v.id("notes"),
    title: v.string(),
    text: v.string(),
    tags: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("User not found");

    const note = await ctx.db.get(args.noteId);
    if (!note) throw new ConvexError("Note not found");
    if (note.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    const oldTags = normalizeTags(note.tags);
    const newTags = normalizeTags(args.tags);

    // Only tags that were newly added
    const addedTags = newTags.filter((tag) => !oldTags.includes(tag));

    // Insert ONLY new tags
    for (const tag of addedTags) {
      const existing = await ctx.db
        .query("tags")
        .withIndex("by_user_normalized", (q) =>
          q.eq("tokenIdentifier", userId).eq("normalized", tag),
        )
        .first();

      if (!existing) {
        await ctx.db.insert("tags", {
          name: tag,
          normalized: tag,
          tokenIdentifier: userId,
        });
      }
    }

    // Update note
    await ctx.db.patch(args.noteId, {
      title: args.title,
      text: args.text,
      tags: args.tags ?? "",
      updatedAt: Date.now(),
    });
  },
});

/* ---------------------------------------------
   DELETE NOTE
--------------------------------------------- */
export const deleteNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("User not found");

    const note = await ctx.db.get(args.noteId);
    if (!note) throw new ConvexError("Note not found");
    if (note.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    await ctx.db.delete(args.noteId);
  },
});

/* ---------------------------------------------
   GET NOTES BY DOCUMENT ID
--------------------------------------------- */
export const getNotesByDocumentId = query({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    return await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("documentId"), args.documentId))
      .collect();
  },
});
