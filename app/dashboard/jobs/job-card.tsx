"use client";

import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import EditJobButton from "./edit-job-button";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
] as const;

/* Status color system (left border only now) */
const STATUS_BORDERS = {
  applied: "border-l-blue-500",
  interview: "border-l-amber-500",
  offer: "border-l-emerald-500",
  rejected: "border-l-rose-500",
  archived: "border-l-zinc-400",
} as const;

export default function JobCard({ job }: { job: Doc<"jobs"> }) {
  const updateStatus = useMutation(api.jobs.updateJobStatus);
  const deleteJob = useMutation(api.jobs.deleteJob);

  const statusLabel =
    STATUS_OPTIONS.find((s) => s.value === job.status)?.label ?? job.status;

  return (
    <Card
      className={cn(
        "border-l-2 shadow-sm transition-all hover:shadow-md",
        STATUS_BORDERS[job.status],
      )}
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">{job.title}</CardTitle>

        <div className="text-sm text-muted-foreground">{job.company}</div>
      </CardHeader>

      <CardContent className="space-y-2">
        {job.location && (
          <div className="text-xs text-muted-foreground">{job.location}</div>
        )}

        {job.notes && (
          <div className="line-clamp-3 whitespace-pre-line text-sm">
            {job.notes}
          </div>
        )}

        {job.link && (
          <Link
            href={job.link}
            target="_blank"
            className="inline-flex items-center gap-1 text-sm underline underline-offset-4"
          >
            Open link <ExternalLink className="h-4 w-4" />
          </Link>
        )}
      </CardContent>

      <CardFooter className="flex items-center gap-2">
        {/* Status dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex w-full justify-between"
            >
              {statusLabel}
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            {STATUS_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() =>
                  updateStatus({ jobId: job._id, status: opt.value })
                }
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Edit */}
        <EditJobButton job={job} />

        {/* Delete */}
        <Button
          variant="destructive"
          size="icon"
          onClick={() => deleteJob({ jobId: job._id })}
          aria-label="Delete job"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
