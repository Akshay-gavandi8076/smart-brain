import { v } from "convex/values";

export const JOB_STATUSES = [
  "applied",
  "interview",
  "offer",
  "rejected",
  "archived",
] as const;

export const jobStatusValidator = v.union(
  ...JOB_STATUSES.map((status) => v.literal(status)),
);
