"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import JobCard from "./job-card";

export default function DraggableJobCard({ job }: { job: Doc<"jobs"> }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job._id });

  // IMPORTANT:
  // CSS.Transform.toString keeps transforms correct (including scale if any),
  // and prevents “weird zoom” artifacts that can happen with Translate-only.
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        // premium interaction
        "touch-none select-none will-change-transform",
        "cursor-grab active:cursor-grabbing",

        // smooth lift feel
        "transition-shadow duration-150 ease-out",
        "hover:shadow-md",

        // when dragging, hide the original (overlay will be visible)
        isDragging && "opacity-0",
      )}
    >
      <JobCard job={job} />
    </div>
  );
}
