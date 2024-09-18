"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/styles";
import CreateNoteForm from "./create-note-form";
import { useToast } from "@/components/ui/use-toast";

export default function CreateNoteButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const handleNoteCreated = () => {
    setIsOpen(false);
    toast({
      title: "Note created",
      description: "Your note has been created successfully.",
    });
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className={btnStyles}>
          <PlusIcon className={btnIconStyles} />
          <span className="hidden sm:inline">Create Note</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Note</DialogTitle>
          <DialogDescription>
            Type whatever you want to be searchable later on.
          </DialogDescription>
          <CreateNoteForm onNoteCreated={handleNoteCreated} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
