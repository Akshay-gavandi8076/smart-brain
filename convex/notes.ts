import { ConvexError, v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import OpenAI from "openai";
import { internal } from "./_generated/api";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getNote = query({
  args: {
    noteId: v.id("notes"),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    const note = await ctx.db.get(args.noteId);

    if (!note) {
      return null;
    }

    if (note.tokenIdentifier !== userId) {
      return null;
    }

    return note;
  },
});

export const getNotes = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
      .order("desc")
      .collect();

    return notes;
  },
});

export async function embed(text: string) {
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
    await ctx.db.patch(args.noteId, {
      embedding: args.embedding,
    });
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
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("User not found");
    }

    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      text: args.text,
      tokenIdentifier: userId,
      tags: args.tags || "",
      documentId: args.documentId,
    });

    await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbedding, {
      noteId,
      title: args.title,
      text: args.text,
    });
  },
});

export const deleteNote = mutation({
  args: {
    noteId: v.id("notes"),
  },

  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("User not found");
    }

    const note = await ctx.db.get(args.noteId);

    if (!note) {
      throw new ConvexError("Note not found");
    }

    if (note.tokenIdentifier !== userId) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.delete(args.noteId);
  },
});

export const updateNote = mutation({
  args: {
    noteId: v.id("notes"),
    title: v.string(),
    text: v.string(),
  },

  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("User not found");
    }

    const note = await ctx.db.get(args.noteId);

    if (!note) {
      throw new ConvexError("Note not found");
    }

    if (note.tokenIdentifier !== userId) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.patch(args.noteId, {
      title: args.title,
      text: args.text,
    });
  },
});

export const getNotesByDocumentId = query({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const notes = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("documentId"), args.documentId))
      .order("desc")
      .collect();
    return notes;
  },
});
