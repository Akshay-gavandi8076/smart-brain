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

export const STATUS_OPTIONS = JOB_STATUSES.map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
}));

export const JOB_STATUS_CONFIG: Record<
  JobStatus,
  {
    label: string;
    badgeClass: string;
    borderClass: string;
    railClass: string;
  }
> = {
  applied: {
    label: "Applied",
    badgeClass:
      "bg-blue-500/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
    borderClass: "border-l-blue-500",
    railClass: "bg-blue-500/70 dark:bg-blue-400/70",
  },
  interview: {
    label: "Interview",
    badgeClass:
      "bg-amber-500/10 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
    borderClass: "border-l-amber-500",
    railClass: "bg-amber-500/70 dark:bg-amber-400/70",
  },
  offer: {
    label: "Offer",
    badgeClass:
      "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
    borderClass: "border-l-emerald-500",
    railClass: "bg-emerald-500/70 dark:bg-emerald-400/70",
  },
  rejected: {
    label: "Rejected",
    badgeClass:
      "bg-rose-500/10 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300",
    borderClass: "border-l-rose-500",
    railClass: "bg-rose-500/70 dark:bg-rose-400/70",
  },
  archived: {
    label: "Archived",
    badgeClass:
      "bg-zinc-500/10 text-zinc-700 dark:bg-zinc-400/15 dark:text-zinc-200",
    borderClass: "border-l-zinc-400",
    railClass: "bg-zinc-500/60 dark:bg-zinc-400/60",
  },
};

export const jobFormSchema = z.object({
  company: z.string().min(2).max(200),
  title: z.string().min(2).max(200),
  status: jobStatusSchema,
  link: z.string().url().optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(5000).optional().or(z.literal("")),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

export function normalizeOptionalField(value?: string) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}
