"use client";

import { Doc } from "@/convex/_generated/dataModel";
import type { JobStatus } from "./page";
import JobCard from "./job-card";
import { cn } from "@/lib/utils";

const COLUMNS: { key: JobStatus; status: string }[] = [
  { key: "applied", status: "Applied" },
  { key: "interview", status: "Interview" },
  { key: "offer", status: "Offer" },
  { key: "rejected", status: "Rejected" },
  { key: "archived", status: "Archived" },
];

function EmptyColumnState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-background/40 p-4 text-center text-sm text-muted-foreground dark:border-zinc-700">
      <div className="font-medium text-foreground/80">No jobs in {label}</div>
      <div className="mt-1 text-xs">
        Create a job or move one here using the status dropdown.
      </div>
    </div>
  );
}

// Tailwind-only color mapping (works with light + dark)
const STATUS_STYLES: Record<
  JobStatus,
  {
    rail: string; // vertical line color
    pill: string; // pill bg + text
  }
> = {
  applied: {
    rail: "bg-blue-500/70 dark:bg-blue-400/70",
    pill: "bg-blue-500/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300",
  },
  interview: {
    rail: "bg-amber-500/70 dark:bg-amber-400/70",
    pill: "bg-amber-500/10 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  },
  offer: {
    rail: "bg-emerald-500/70 dark:bg-emerald-400/70",
    pill: "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  rejected: {
    rail: "bg-rose-500/70 dark:bg-rose-400/70",
    pill: "bg-rose-500/10 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300",
  },
  archived: {
    rail: "bg-zinc-500/60 dark:bg-zinc-400/60",
    pill: "bg-zinc-500/10 text-zinc-700 dark:bg-zinc-400/15 dark:text-zinc-200",
  },
};

export default function JobList({
  grouped,
  stickyOffsetPx,
}: {
  grouped: Record<JobStatus, Doc<"jobs">[]>;
  stickyOffsetPx: number; // comes from JobsPage header height
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {COLUMNS.map((col) => {
        const styles = STATUS_STYLES[col.key];

        return (
          <section
            key={col.key}
            className="rounded-2xl bg-zinc-100 p-3 shadow-sm dark:bg-zinc-900"
          >
            {/* Sticky column header */}
            <div className="sticky z-20" style={{ top: stickyOffsetPx }}>
              <div className="relative rounded-xl border bg-background/80 px-3 py-2 shadow-sm backdrop-blur dark:bg-zinc-950/60">
                {/* Left & right vertical rails */}
                <span
                  className={cn(
                    "absolute bottom-2 left-2 top-2 w-[3px] rounded-full",
                    styles.rail,
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "absolute bottom-2 right-2 top-2 w-[3px] rounded-full",
                    styles.rail,
                  )}
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between pl-4 pr-4">
                  {/* Status “pill” */}
                  <div
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
                      styles.pill,
                    )}
                  >
                    {col.status}
                  </div>

                  {/* Count */}
                  <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs dark:bg-zinc-800">
                    {grouped[col.key].length}
                  </span>
                </div>
              </div>

              {/* Spacer so cards don't touch sticky header */}
              <div className="h-3" />
            </div>

            <div className="space-y-3">
              {grouped[col.key].length === 0 ? (
                <EmptyColumnState label={col.status} />
              ) : (
                grouped[col.key].map((job) => (
                  <JobCard key={job._id} job={job} />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
