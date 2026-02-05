"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LoadingButton } from "@/components/loading-button";

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

export default function DeleteJobButton({ jobId }: { jobId: Id<"jobs"> }) {
  const deleteJob = useMutation(api.jobs.deleteJob);
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteJob({ jobId });
      setOpen(false);
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
        <Button variant="destructive" size="icon" aria-label="Delete job">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this job?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can’t be undone. The job will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          {/* Keep shadcn structure; use LoadingButton for consistent UX */}
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
