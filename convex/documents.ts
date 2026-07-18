import {
  MutationCtx,
  QueryCtx,
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { ConvexError, v } from "convex/values";

import { internal } from "./_generated/api";
import OpenAI from "openai";
import { Id } from "./_generated/dataModel";
import { getUserId, requireUserId } from "./lib/auth";
import { embed, openai } from "./lib/openai";

export async function hasAccessToDocument(
  ctx: MutationCtx | QueryCtx,
  documentId: Id<"documents">,
) {
  const userId = await getUserId(ctx);
  if (!userId) return null;

  const document = await ctx.db.get(documentId);
  if (!document || document.tokenIdentifier !== userId) return null;

  return { document, userId };
}

export const hasAccessToDocumentQuery = internalQuery({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    return await hasAccessToDocument(ctx, args.documentId);
  },
});

export const getDocumentTitleInternal = internalQuery({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const document = await ctx.db.get(args.documentId);
    return document?.title ?? "document";
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getDocuments = query({
  async handler(ctx) {
    const userId = await getUserId(ctx);
    if (!userId) return undefined;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
      .collect();

    documents.sort((a, b) => b._creationTime - a._creationTime);

    return documents;
  },
});

export const getDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const accessObj = await hasAccessToDocument(ctx, args.documentId);

    if (!accessObj) {
      return null;
    }

    return {
      ...accessObj.document,
      documentUrl: await ctx.storage.getUrl(accessObj.document.fileId),
    };
  },
});

export const createDocument = mutation({
  args: {
    title: v.string(),
    tags: v.optional(v.string()),
    fileId: v.id("_storage"),
  },
  async handler(ctx, args) {
    const userId = await requireUserId(ctx);
    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      tokenIdentifier: userId,
      fileId: args.fileId,
      tags: args.tags || "",
    });

    await ctx.scheduler.runAfter(
      0,
      internal.documents.generateDocumentDescription,
      {
        fileId: args.fileId,
        documentId,
      },
    );
  },
});

const DESCRIPTION_UNAVAILABLE =
  "AI summary unavailable. Open the document to read the full contents.";

export const generateDocumentDescription = internalAction({
  args: {
    fileId: v.id("_storage"),
    documentId: v.id("documents"),
  },

  async handler(ctx, args) {
    const title = await ctx.runQuery(
      internal.documents.getDocumentTitleInternal,
      { documentId: args.documentId },
    );

    const saveDescription = async (description: string) => {
      let embedding: number[] | undefined;
      try {
        embedding = await embed(description);
      } catch {
        try {
          embedding = await embed(title);
        } catch {
          embedding = undefined;
        }
      }

      await ctx.runMutation(internal.documents.updateDocumentDescription, {
        documentId: args.documentId,
        description,
        embedding,
      });
    };

    try {
      const file = await ctx.storage.get(args.fileId);

      if (!file) {
        await saveDescription("File could not be read.");
        return;
      }

      const text = await file.text();

      const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
        await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `Here is a text file: ${text}`,
            },
            {
              role: "user",
              content: `please generate 1 sentence description for this document.`,
            },
          ],
          model: "gpt-3.5-turbo",
        });

      const description =
        chatCompletion.choices[0].message.content ?? DESCRIPTION_UNAVAILABLE;

      await saveDescription(description);
    } catch {
      await saveDescription(DESCRIPTION_UNAVAILABLE);
    }
  },
});

export const updateDocumentDescription = internalMutation({
  args: {
    documentId: v.id("documents"),
    description: v.string(),
    embedding: v.optional(v.array(v.float64())),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.documentId, {
      description: args.description,
      ...(args.embedding ? { embedding: args.embedding } : {}),
    });
  },
});

export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const accessObj = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      {
        documentId: args.documentId,
      },
    );

    if (!accessObj) {
      throw new ConvexError("You do not have access to this document");
    }

    const file = await ctx.storage.get(accessObj.document.fileId);

    if (!file) {
      throw new ConvexError("File not found");
    }

    const text = await file.text();

    const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
      await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Here is a text file: ${text}`,
          },
          {
            role: "user",
            content: `please answer this question: ${args.question}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: args.question,
      isHuman: true,
      tokenIdentifier: accessObj.userId,
    });

    const response =
      chatCompletion.choices[0].message.content ??
      "Could not generate a response";

    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: response,
      isHuman: false,
      tokenIdentifier: accessObj.userId,
    });

    return response;
  },
});

export const deleteDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const accessObj = await hasAccessToDocument(ctx, args.documentId);

    if (!accessObj) {
      throw new ConvexError("You do not have access to this document");
    }

    const chats = await ctx.db
      .query("chats")
      .withIndex("by_documentId_tokenIdentifier", (q) =>
        q
          .eq("documentId", args.documentId)
          .eq("tokenIdentifier", accessObj.userId),
      )
      .collect();

    for (const chat of chats) {
      await ctx.db.delete(chat._id);
    }

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_documentId", (q) => q.eq("documentId", args.documentId))
      .collect();

    for (const note of notes) {
      if (note.tokenIdentifier === accessObj.userId) {
        await ctx.db.delete(note._id);
      }
    }

    await ctx.storage.delete(accessObj.document.fileId);

    await ctx.db.delete(args.documentId);
  },
});
