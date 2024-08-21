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
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

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
          <DialogTitle>Create a document</DialogTitle>
          <DialogDescription>
            Type whatever you want to be searchable later on.
          </DialogDescription>
          <CreateNoteForm
            onNoteCreated={() => {
              setIsOpen(false);

              toast({
                title: "Note created",
                description: "Your note has been created successfully.",
              });
            }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
