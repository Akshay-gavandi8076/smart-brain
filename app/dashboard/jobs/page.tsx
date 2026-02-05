"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { Skeleton } from "@/components/ui/skeleton";
import CreateJobButton from "./create-job-button";
import JobList from "./job-list";

export type JobStatus =
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "archived";

export default function JobsPage() {
  const jobs = useQuery(api.jobs.getJobs);

  const grouped = useMemo(() => {
    const empty: Record<JobStatus, Doc<"jobs">[]> = {
      applied: [],
      interview: [],
      offer: [],
      rejected: [],
      archived: [],
    };

    if (!jobs) return empty;

    for (const job of jobs) empty[job.status].push(job);
    return empty;
  }, [jobs]);

  if (!jobs) {
    return (
      <main className="flex h-full w-full flex-col">
        {/* Sticky page header */}
        <header className="sticky top-0 z-30 border-b bg-background">
          <div className="flex h-16 items-center justify-between px-2 sm:px-0">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </header>

        <div className="flex-1 overflow-auto px-2 pb-6 pt-4 sm:px-0">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[520px] rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-full w-full flex-col">
      {/* Sticky page header */}
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-2 sm:px-0">
          <h1 className="text-2xl font-bold sm:text-4xl">Jobs</h1>
          <CreateJobButton />
        </div>
      </header>

      {/* One global scroll container */}
      <div className="flex-1 overflow-auto px-2 pb-6 pt-4 sm:px-0">
        <JobList grouped={grouped} stickyOffsetPx={10} />
      </div>
    </main>
  );
}
