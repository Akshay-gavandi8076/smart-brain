import { v } from "convex/values";
import { JOB_STATUSES } from "../../lib/jobs";

export const jobStatusValidator = v.union(
  ...JOB_STATUSES.map((status) => v.literal(status)),
);
