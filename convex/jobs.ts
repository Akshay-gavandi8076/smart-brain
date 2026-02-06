// convex\jobs.ts
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * JOBS
 * - tokenIdentifier is the user key (same pattern as your notes/documents)
 * - movedAt is used for “newest moved first” ordering within a status
 */

export const getJobs = query({
  args: {},
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return null;

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .collect();

    // Newest first: movedAt if present, else createdAt
    jobs.sort((a, b) => {
      const at = (a.movedAt ?? a.createdAt) as number;
      const bt = (b.movedAt ?? b.createdAt) as number;
      return bt - at;
    });

    return jobs;
  },
});

export const createJob = mutation({
  args: {
    company: v.string(),
    title: v.string(),
    status: v.union(
      v.literal("applied"),
      v.literal("interview"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("archived"),
    ),
    link: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("User not found");

    const now = Date.now();

    return await ctx.db.insert("jobs", {
      company: args.company,
      title: args.title,
      status: args.status,
      link: args.link,
      location: args.location,
      notes: args.notes,
      tokenIdentifier: userId,
      createdAt: now,
      movedAt: now, // initial ordering uses movedAt too
    });
  },
});

export const deleteJob = mutation({
  args: {
    jobId: v.id("jobs"),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("User not found");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new ConvexError("Job not found");
    if (job.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    await ctx.db.delete(args.jobId);
  },
});

export const updateJob = mutation({
  args: {
    jobId: v.id("jobs"),
    company: v.string(),
    title: v.string(),
    status: v.union(
      v.literal("applied"),
      v.literal("interview"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("archived"),
    ),
    link: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("User not found");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new ConvexError("Job not found");
    if (job.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    await ctx.db.patch(args.jobId, {
      company: args.company,
      title: args.title,
      status: args.status,
      link: args.link,
      location: args.location,
      notes: args.notes,
      // don't touch movedAt here; only moveJob / status move should set it
    });
  },
});

export const updateJobStatus = mutation({
  args: {
    jobId: v.id("jobs"),
    status: v.union(
      v.literal("applied"),
      v.literal("interview"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("archived"),
    ),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("User not found");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new ConvexError("Job not found");
    if (job.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    await ctx.db.patch(args.jobId, {
      status: args.status,
      movedAt: Date.now(), // treat status change as “latest move”
    });
  },
});

/**
 * ✅ Needed for drag-and-drop column moves
 * Set status + movedAt (newest move first)
 */
export const moveJob = mutation({
  args: {
    jobId: v.id("jobs"),
    status: v.union(
      v.literal("applied"),
      v.literal("interview"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("archived"),
    ),
    movedAt: v.number(),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("User not found");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new ConvexError("Job not found");
    if (job.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    await ctx.db.patch(args.jobId, {
      status: args.status,
      movedAt: args.movedAt,
    });
  },
});
