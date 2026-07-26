"use client";

import { DeleteButton } from "@/components/DeleteButton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

interface DeleteJobButtonProps {
  jobId: Id<"jobs">;
  iconOnly?: boolean;
  onDeleted?: () => void;
}

export function DeleteJobButton({
  jobId,
  iconOnly = false,
  onDeleted,
}: DeleteJobButtonProps) {
  const deleteJob = useMutation(api.jobs.deleteJob);

  return (
    <DeleteButton<Id<"jobs">>
      id={jobId}
      entityType="job"
      iconOnly={iconOnly}
      onDelete={async ({ id }) => {
        await deleteJob({ jobId: id });
        onDeleted?.();
      }}
      confirmationMessage="Are you sure you want to delete this job?"
    />
  );
}

// }
