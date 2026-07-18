import { z } from "zod";

export const JOB_STATUSES = [
  "applied",
  "interview",
  "offer",
  "rejected",
  "archived",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const jobStatusSchema = z.enum(JOB_STATUSES);

export const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

export const jobFormSchema = z.object({
  company: z.string().min(2, "Company must be at least 2 characters").max(200),
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  status: jobStatusSchema,
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(5000).optional().or(z.literal("")),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

/** Trim optional string fields; empty strings become undefined. */
export function normalizeOptionalField(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}
