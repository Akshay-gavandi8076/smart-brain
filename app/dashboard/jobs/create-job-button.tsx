"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { btnIconStyles, btnStyles } from "@/styles/styles";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CreateJobForm from "./create-job-form";

export default function CreateJobButton() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onJobCreated = () => {
    setOpen(false);
    toast({
      title: "Job created",
      description: "Your job has been created successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={btnStyles}>
          <PlusIcon className={btnIconStyles} />
          <span className="hidden sm:inline">Create Job</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Job</DialogTitle>
          <DialogDescription>
            Track your applications in one place.
          </DialogDescription>
        </DialogHeader>

        <CreateJobForm onJobCreated={onJobCreated} />
      </DialogContent>
    </Dialog>
  );
}
