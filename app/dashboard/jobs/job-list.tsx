"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import JobCard from "./job-card";
import { cn } from "@/lib/utils";

import {
  JOB_STATUSES,
  JOB_STATUS_CONFIG,
  STATUS_OPTIONS,
  type JobStatus,
} from "@/lib/jobs";

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

function EmptyColumnState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-background/40 p-4 text-center text-sm text-muted-foreground dark:border-zinc-700">
      <div className="font-medium text-foreground/80">No jobs in {label}</div>
      <div className="mt-1 text-xs">Create a job or move one here.</div>
    </div>
  );
}

function isJobStatus(value: unknown): value is JobStatus {
  return typeof value === "string" && JOB_STATUSES.includes(value as JobStatus);
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
        {STATUS_OPTIONS.map((col) => {
          const status = JOB_STATUS_CONFIG[col.value];
          const jobsInCol = grouped[col.value];
          console.log(status);

          return (
            <DroppableColumn key={col.value} statusKey={col.value}>
              <section className="rounded-2xl bg-zinc-100 p-3 shadow-sm dark:bg-zinc-900">
                {/* Sticky column header */}
                <div className="sticky z-20" style={{ top: stickyOffsetPx }}>
                  <div className="relative rounded-xl border bg-background/80 px-3 py-2 shadow-sm backdrop-blur dark:bg-zinc-950/60">
                    {/* Left & right rails */}
                    <span
                      className={cn(
                        "absolute bottom-2 left-2 top-2 w-[3px] rounded-full",
                        status.railClass,
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "absolute bottom-2 right-2 top-2 w-[3px] rounded-full",
                        status.railClass,
                      )}
                      aria-hidden="true"
                    />

                    <div className="flex items-center justify-between pl-4 pr-4">
                      <div
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
                          status.badgeClass,
                        )}
                      >
                        {col.label}
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
                    <EmptyColumnState label={col.label} />
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
