"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LoadingButton } from "@/components/loading-button";
import { btnIconStyles, btnStyles } from "@/styles/styles";
import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Id } from "@/convex/_generated/dataModel";

interface DeleteJobButtonProps {
  jobId: Id<"jobs">;
  showLabel?: boolean;
  className?: string;
  onDeleted?: () => void;
}

export default function DeleteJobButton({
  jobId,
  showLabel = false,
  className,
  onDeleted,
}: DeleteJobButtonProps) {
  const deleteJob = useMutation(api.jobs.deleteJob);
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteJob({ jobId });
      setOpen(false);
      onDeleted?.();
      toast({
        title: "Job deleted",
        description: "The job entry was deleted successfully.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Delete failed",
        description: "Could not delete the job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size={showLabel ? "default" : "icon"}
          className={cn(showLabel ? btnStyles : undefined, className)}
          aria-label="Delete job"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className={btnIconStyles} />
          {showLabel && <span>Delete</span>}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this job?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can&apos;t be undone. The job will be permanently
            removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          <AlertDialogAction asChild>
            <LoadingButton
              isLoading={isDeleting}
              loadingText="Deleting..."
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
            >
              Delete
            </LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
