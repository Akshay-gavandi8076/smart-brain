"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DeleteJobButton from "./delete-job-button";
import {
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  StickyNote,
  Link2,
} from "lucide-react";
import { formatJobDate, getJobUpdatedAt } from "@/lib/formatDate";
import EditJobButton from "./edit-job-button";
import { cn } from "@/lib/utils";
import { JOB_STATUS_CONFIG } from "@/lib/jobs";

interface JobDetailDialogProps {
  job: Doc<"jobs"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function JobDetailDialog({
  job,
  open,
  onOpenChange,
}: JobDetailDialogProps) {
  if (!job) return null;

  const statusConfig = JOB_STATUS_CONFIG[job.status];
  const updatedAt = getJobUpdatedAt(job);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 overflow-hidden border-l-4 p-0 sm:max-w-xl",
          statusConfig.borderClass,
        )}
      >
        {/* Header */}
        <DialogHeader className="space-y-3 border-b bg-muted/30 px-6 py-5">
          <div className="flex flex-wrap items-center gap-2 pr-6">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                statusConfig.badgeClass,
              )}
            >
              {statusConfig.label}
            </span>
          </div>
          <DialogTitle className="text-left text-2xl leading-tight">
            {job.title}
          </DialogTitle>
          <p className="text-left text-base font-medium text-muted-foreground">
            {job.company}
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <MetaCard
              icon={<Calendar className="h-4 w-4" />}
              label="Created"
              value={formatJobDate(job.createdAt)}
            />
            <MetaCard
              icon={<Clock className="h-4 w-4" />}
              label="Last updated"
              value={formatJobDate(updatedAt)}
            />
          </div>

          {job.location && (
            <Section icon={<MapPin className="h-4 w-4" />} label="Location">
              {job.location}
            </Section>
          )}

          {job.link && (
            <Section icon={<Link2 className="h-4 w-4" />} label="Job link">
              <Link
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-sm text-blue-600 underline underline-offset-4 hover:text-blue-500 dark:text-blue-400"
              >
                {job.link}
                <ExternalLink className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            </Section>
          )}

          {job.notes ? (
            <Section icon={<StickyNote className="h-4 w-4" />} label="Notes">
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {job.notes}
              </p>
            </Section>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No notes added.
            </p>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex-row gap-2 border-t bg-muted/20 px-6 py-4 sm:justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            <EditJobButton job={job} showLabel />
            <DeleteJobButton
              jobId={job._id}
              showLabel
              onDeleted={() => onOpenChange(false)}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border bg-background p-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function Section({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
