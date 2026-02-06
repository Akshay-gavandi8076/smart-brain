"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import type { JobStatus } from "./page";
import JobCard from "./job-card";
import { cn } from "@/lib/utils";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

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
      <div className="mt-1 text-xs">Create a job or move one here.</div>
    </div>
  );
}

// Tailwind-only color mapping (works with light + dark)
const STATUS_STYLES: Record<
  JobStatus,
  {
    rail: string;
    pill: string;
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

function isJobStatus(value: unknown): value is JobStatus {
  return (
    value === "applied" ||
    value === "interview" ||
    value === "offer" ||
    value === "rejected" ||
    value === "archived"
  );
}

/**
 * Droppable column:
 * - id = status string
 * - ALWAYS droppable (even if empty)
 */
function DroppableColumn({
  statusKey,
  children,
}: {
  statusKey: JobStatus;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: statusKey });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-2xl transition",
        isOver && "ring-2 ring-zinc-400/60 dark:ring-zinc-600/60",
      )}
    >
      {children}
    </div>
  );
}

/**
 * Draggable wrapper (handle-only):
 * - draggable id = jobId
 * - data includes fromStatus so we can skip unnecessary writes
 */
function DraggableJob({ job }: { job: Doc<"jobs"> }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: job._id,
    data: { type: "job", fromStatus: job.status },
  });

  return (
    <div ref={setNodeRef} className={cn(isDragging && "opacity-30")}>
      <JobCard
        job={job}
        // ✅ Only the grip is draggable
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function JobList({
  grouped,
  stickyOffsetPx,
}: {
  grouped: Record<JobStatus, Doc<"jobs">[]>;
  stickyOffsetPx: number;
}) {
  const moveJob = useMutation(api.jobs.moveJob);

  const [activeJobId, setActiveJobId] = useState<Id<"jobs"> | null>(null);

  // Map jobs for overlay rendering
  const jobById = useMemo(() => {
    const map = new Map<string, Doc<"jobs">>();
    (Object.keys(grouped) as JobStatus[]).forEach((status) => {
      grouped[status].forEach((j) => map.set(String(j._id), j));
    });
    return map;
  }, [grouped]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJobId(null);

    if (!over) return;

    // draggable is jobId
    const jobId = active.id as Id<"jobs">;

    // over can be:
    // 1) a column (id=status)
    // 2) a job card (id=jobId)
    // so we normalize to a status
    let destStatus: JobStatus | null = null;

    if (isJobStatus(over.id)) {
      destStatus = over.id;
    } else {
      const overJob = jobById.get(String(over.id));
      if (overJob) destStatus = overJob.status;
    }

    if (!destStatus) return;

    const fromStatus = active.data.current?.fromStatus as JobStatus | undefined;
    if (fromStatus === destStatus) return;

    await moveJob({
      jobId,
      status: destStatus,
      movedAt: Date.now(), // newest-first
    });
  };

  const activeJob = activeJobId ? jobById.get(String(activeJobId)) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveJobId(e.active.id as Id<"jobs">)}
      onDragEnd={onDragEnd}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {COLUMNS.map((col) => {
          const styles = STATUS_STYLES[col.key];
          const jobsInCol = grouped[col.key];

          return (
            <DroppableColumn key={col.key} statusKey={col.key}>
              <section className="rounded-2xl bg-zinc-100 p-3 shadow-sm dark:bg-zinc-900">
                {/* Sticky column header */}
                <div className="sticky z-20" style={{ top: stickyOffsetPx }}>
                  <div className="relative rounded-xl border bg-background/80 px-3 py-2 shadow-sm backdrop-blur dark:bg-zinc-950/60">
                    {/* Left & right rails */}
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
                      <div
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
                          styles.pill,
                        )}
                      >
                        {col.status}
                      </div>

                      <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs dark:bg-zinc-800">
                        {jobsInCol.length}
                      </span>
                    </div>
                  </div>

                  <div className="h-3" />
                </div>

                <div className="space-y-3">
                  {jobsInCol.length === 0 ? (
                    <EmptyColumnState label={col.status} />
                  ) : (
                    jobsInCol.map((job) => (
                      <DraggableJob key={job._id} job={job} />
                    ))
                  )}
                </div>
              </section>
            </DroppableColumn>
          );
        })}
      </div>

      {/* Premium overlay: stable size, no “zoom” */}
      <DragOverlay dropAnimation={{ duration: 140, easing: "ease-out" }}>
        {activeJob ? (
          <div className="w-full max-w-[360px]">
            <JobCard job={activeJob} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
