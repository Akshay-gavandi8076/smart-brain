"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { btnIconStyles, btnStyles } from "@/styles/styles";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditJobForm from "./edit-job-form";

interface EditJobButtonProps {
  job: Doc<"jobs">;
  showLabel?: boolean;
  className?: string;
}

export default function EditJobButton({
  job,
  showLabel = false,
  className,
}: EditJobButtonProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onSaved = () => {
    setOpen(false);
    toast({
      title: "Job updated",
      description: "Your job has been updated successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={showLabel ? "default" : "icon"}
          className={cn(showLabel ? btnStyles : undefined, className)}
          aria-label="Edit job"
          onClick={(e) => e.stopPropagation()}
        >
          <Pencil className={btnIconStyles} />
          {showLabel && <span>Edit</span>}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
          <DialogDescription>Update the details and status.</DialogDescription>
        </DialogHeader>

        <EditJobForm job={job} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}
