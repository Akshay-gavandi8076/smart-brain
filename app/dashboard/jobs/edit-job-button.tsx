"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditJobForm from "./edit-job-form";

export default function EditJobButton({ job }: { job: Doc<"jobs"> }) {
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
        <Button variant="outline" size="icon" aria-label="Edit job">
          <Pencil className="h-4 w-4" />
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
