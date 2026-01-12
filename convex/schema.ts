import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /** Documents Schema */
  documents: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    tokenIdentifier: v.string(),
    embedding: v.optional(v.array(v.float64())),
    fileId: v.id("_storage"),
    tags: v.optional(v.string()),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["tokenIdentifier"],
    }),

  /** Notes Schema */
  notes: defineTable({
    title: v.string(),
    text: v.string(),
    embedding: v.optional(v.array(v.float64())),
    tokenIdentifier: v.string(),
    tags: v.optional(v.string()),
    documentId: v.optional(v.id("documents")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("by_documentId", ["documentId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["tokenIdentifier"],
    }),

  /** Chats Schema */
  chats: defineTable({
    documentId: v.id("documents"),
    tokenIdentifier: v.string(),
    isHuman: v.boolean(),
    text: v.string(),
  }).index("by_documentId_tokenIdentifier", ["documentId", "tokenIdentifier"]),

  /** Tags Schema */
  tags: defineTable({
    name: v.string(),
    normalized: v.string(),
    tokenIdentifier: v.string(),
    usageCount: v.optional(v.number()),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("by_normalized", ["normalized", "tokenIdentifier"]),
});
