import { ConvexError, v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { getUserId, requireUserId } from "./lib/auth";
import { embed } from "./lib/openai";
import { parseTagString, syncAddedTags, syncTags } from "./lib/tags";

export const getNote = query({
  args: {
    noteId: v.id("notes"),
  },
  async handler(ctx, args) {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const note = await ctx.db.get(args.noteId);
    if (!note || note.tokenIdentifier !== userId) return null;

    const document = note.documentId ? await ctx.db.get(note.documentId) : null;
    return { ...note, document };
  },
});

export const getNotes = query({
  async handler(ctx) {
    const userId = await getUserId(ctx);
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

export const createNote = mutation({
  args: {
    title: v.string(),
    text: v.string(),
    tags: v.optional(v.string()),
    documentId: v.optional(v.id("documents")),
  },
  async handler(ctx, args) {
    const userId = await requireUserId(ctx);
    const tags = parseTagString(args.tags);

    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      text: args.text,
      tokenIdentifier: userId,
      tags: args.tags ?? "",
      documentId: args.documentId,
      updatedAt: Date.now(),
    });

    await syncTags(ctx, userId, tags);

    await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbedding, {
      noteId,
      title: args.title,
      text: args.text,
    });
  },
});

export const updateNote = mutation({
  args: {
    noteId: v.id("notes"),
    title: v.string(),
    text: v.string(),
    tags: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = await requireUserId(ctx);
    const note = await ctx.db.get(args.noteId);
    if (!note) throw new ConvexError("Note not found");
    if (note.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    const previousTags = parseTagString(note.tags);
    const nextTags = parseTagString(args.tags);
    await syncAddedTags(ctx, userId, previousTags, nextTags);

    await ctx.db.patch(args.noteId, {
      title: args.title,
      text: args.text,
      tags: args.tags ?? "",
      updatedAt: Date.now(),
    });

    if (args.text !== note.text) {
      await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbedding, {
        noteId: args.noteId,
        title: args.title,
        text: args.text,
      });
    }
  },
});

export const deleteNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  async handler(ctx, args) {
    const userId = await requireUserId(ctx);
    const note = await ctx.db.get(args.noteId);
    if (!note) throw new ConvexError("Note not found");
    if (note.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    await ctx.db.delete(args.noteId);
  },
});

export const getNotesByDocumentId = query({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const document = await ctx.db.get(args.documentId);
    if (!document || document.tokenIdentifier !== userId) return [];

    return await ctx.db
      .query("notes")
      .withIndex("by_documentId", (q) => q.eq("documentId", args.documentId))
      .filter((q) => q.eq(q.field("tokenIdentifier"), userId))
      .collect();
  },
});
