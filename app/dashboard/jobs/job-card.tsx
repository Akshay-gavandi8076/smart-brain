"use client";

import * as React from "react";
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
import {
  ExternalLink,
  Trash2,
  ChevronDown,
  GripVertical,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import EditJobButton from "./edit-job-button";
import JobDetailDialog from "./job-detail-dialog";
import { cn } from "@/lib/utils";
import { formatJobDate, getJobUpdatedAt } from "@/lib/formatDate";
import { STATUS_OPTIONS, JOB_STATUS_CONFIG } from "@/lib/jobs";

type DragHandleProps = React.HTMLAttributes<HTMLButtonElement>;

export default function JobCard({
  job,
  dragHandleProps,
}: {
  job: Doc<"jobs">;
  dragHandleProps?: DragHandleProps;
}) {
  const updateStatus = useMutation(api.jobs.updateJobStatus);
  const deleteJob = useMutation(api.jobs.deleteJob);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const statusLabel = JOB_STATUS_CONFIG[job.status].label;

  const updatedAt = getJobUpdatedAt(job);

  return (
    <>
      <Card
        className={cn(
          "border-l-2 shadow-sm transition-all hover:shadow-md",
          JOB_STATUS_CONFIG[job.status].borderClass,
        )}
      >
        <CardHeader className="space-y-1">
          <div className="flex items-start gap-2">
            <button
              type="button"
              aria-label="Drag job"
              className="mt-0.5 rounded-md p-1 text-muted-foreground hover:bg-accent"
              onClick={(e) => e.stopPropagation()}
              {...dragHandleProps}
            >
              <GripVertical className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="min-w-0 flex-1 text-left"
              onClick={() => setDetailOpen(true)}
            >
              <CardTitle className="truncate text-base hover:text-blue-600 dark:hover:text-blue-400">
                {job.title}
              </CardTitle>
              <div className="text-sm text-muted-foreground">{job.company}</div>
            </button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              aria-label="View job details"
              onClick={() => setDetailOpen(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 shrink-0" />
              Created {formatJobDate(job.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 shrink-0" />
              Updated {formatJobDate(updatedAt)}
            </span>
          </div>

          {job.location && (
            <div className="text-xs text-muted-foreground">{job.location}</div>
          )}

          {job.notes && (
            <div className="line-clamp-2 whitespace-pre-line text-sm">
              {job.notes}
            </div>
          )}

          {job.link && (
            <Link
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm underline underline-offset-4"
              onClick={(e) => e.stopPropagation()}
            >
              Open link <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </CardContent>

        <CardFooter
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
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

          <EditJobButton job={job} />

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

      <JobDetailDialog
        job={job}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
