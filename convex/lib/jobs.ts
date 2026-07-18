import { v } from "convex/values";

export const jobStatusValidator = v.union(
  v.literal("applied"),
  v.literal("interview"),
  v.literal("offer"),
  v.literal("rejected"),
  v.literal("archived"),
);
