"use client";

import { DeleteButton } from "@/components/shared/delete-button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

interface DeleteJobButtonProps {
  jobId: Id<"jobs">;
  jobTitle?: string;
  iconOnly?: boolean;
  onDeleted?: () => void;
}

export function DeleteJobButton({
  jobId,
  jobTitle,
  iconOnly = false,
  onDeleted,
}: DeleteJobButtonProps) {
  const deleteJob = useMutation(api.jobs.deleteJob);

  return (
    <DeleteButton<Id<"jobs">>
      id={jobId}
      entityType="job"
      entityName={jobTitle}
      iconOnly={iconOnly}
      onDelete={async ({ id }) => {
        await deleteJob({ jobId: id });
        onDeleted?.();
      }}
    />
  );
}
