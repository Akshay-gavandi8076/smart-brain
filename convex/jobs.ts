import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId, requireUserId } from "./lib/auth";
import { jobStatusValidator } from "./lib/jobs";

export const getJobs = query({
  args: {},
  async handler(ctx) {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .collect();

    jobs.sort((a, b) => {
      const aTime = a.movedAt ?? a.createdAt;
      const bTime = b.movedAt ?? b.createdAt;
      return bTime - aTime;
    });

    return jobs;
  },
});

export const createJob = mutation({
  args: {
    company: v.string(),
    title: v.string(),
    status: jobStatusValidator,
    link: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = await requireUserId(ctx);
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
      updatedAt: now,
      movedAt: now,
    });
  },
});

export const deleteJob = mutation({
  args: {
    jobId: v.id("jobs"),
  },
  async handler(ctx, args) {
    const userId = await requireUserId(ctx);
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
    status: jobStatusValidator,
    link: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = await requireUserId(ctx);
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new ConvexError("Job not found");
    if (job.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    const now = Date.now();
    await ctx.db.patch(args.jobId, {
      company: args.company,
      title: args.title,
      status: args.status,
      link: args.link,
      location: args.location,
      notes: args.notes,
      updatedAt: now,
    });
  },
});

export const updateJobStatus = mutation({
  args: {
    jobId: v.id("jobs"),
    status: jobStatusValidator,
  },
  async handler(ctx, args) {
    const userId = await requireUserId(ctx);
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new ConvexError("Job not found");
    if (job.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    const now = Date.now();
    await ctx.db.patch(args.jobId, {
      status: args.status,
      movedAt: now,
      updatedAt: now,
    });
  },
});

export const moveJob = mutation({
  args: {
    jobId: v.id("jobs"),
    status: jobStatusValidator,
    movedAt: v.number(),
  },
  async handler(ctx, args) {
    const userId = await requireUserId(ctx);
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new ConvexError("Job not found");
    if (job.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    await ctx.db.patch(args.jobId, {
      status: args.status,
      movedAt: args.movedAt,
      updatedAt: args.movedAt,
    });
  },
});
