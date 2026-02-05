import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

const statusValidator = v.union(
  v.literal("applied"),
  v.literal("interview"),
  v.literal("offer"),
  v.literal("rejected"),
  v.literal("archived"),
);

// ✅ Get all jobs for current user
export const getJobs = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return [];

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .order("desc")
      .collect();

    // newest first
    jobs.sort(
      (a, b) =>
        (b.createdAt ?? b._creationTime) - (a.createdAt ?? a._creationTime),
    );
    return jobs;
  },
});

// ✅ Get single job
export const getJob = query({
  args: { jobId: v.id("jobs") },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return null;

    const job = await ctx.db.get(args.jobId);
    if (!job || job.tokenIdentifier !== userId) return null;

    return job;
  },
});

// ✅ Create job
export const createJob = mutation({
  args: {
    company: v.string(),
    title: v.string(),
    status: statusValidator,
    location: v.optional(v.string()),
    link: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("User not found");

    const jobId = await ctx.db.insert("jobs", {
      tokenIdentifier: userId,
      company: args.company,
      title: args.title,
      status: args.status,
      location: args.location,
      link: args.link,
      notes: args.notes,
      createdAt: Date.now(),
    });

    return jobId;
  },
});

// ✅ Update full job (EDIT modal uses this)
export const updateJob = mutation({
  args: {
    jobId: v.id("jobs"),
    company: v.string(),
    title: v.string(),
    status: statusValidator,
    location: v.optional(v.string()),
    link: v.optional(v.string()),
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
      location: args.location,
      link: args.link,
      notes: args.notes,
    });

    return null;
  },
});

// ✅ Update only status (kanban dropdown uses this)
export const updateJobStatus = mutation({
  args: { jobId: v.id("jobs"), status: statusValidator },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("User not found");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new ConvexError("Job not found");
    if (job.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    await ctx.db.patch(args.jobId, { status: args.status });
    return null;
  },
});

// ✅ Delete
export const deleteJob = mutation({
  args: { jobId: v.id("jobs") },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new ConvexError("User not found");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new ConvexError("Job not found");
    if (job.tokenIdentifier !== userId) throw new ConvexError("Unauthorized");

    await ctx.db.delete(args.jobId);
    return null;
  },
});
