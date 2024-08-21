"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  text: z.string().min(2).max(5000),
  tags: z.string().optional(), // Tags are optional
});

type FormValues = z.infer<typeof formSchema>;

export default function NoteForm({
  documentId,
  documentTitle,
  onClose,
  onNoteCreated,
}: {
  documentId: Id<"documents">;
  documentTitle: string;
  onClose: () => void;
  onNoteCreated: (note: any) => void;
}) {
  const createNote = useMutation(api.notes.createNote);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      tags: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const newNote = await createNote({
        title: documentTitle,
        text: values.text,
        tags: values.tags,
        documentId,
      });
      if (newNote) {
        onNoteCreated(newNote);
      }
      onClose();
      reset();
    } catch (error) {
      console.error("Failed to create note", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textarea
        placeholder="Write your note here"
        {...register("text")}
        className={`w-full bg-zinc-200 dark:bg-zinc-950 ${errors.text ? "border-red-500" : ""} resize-none`}
        rows={8}
      />
      {errors.text && <p className="text-red-500">{errors.text.message}</p>}

      <Input
        type="text"
        placeholder="Tags (comma separated)"
        {...register("tags")}
        className="bg-zinc-200 dark:bg-zinc-950"
      />
      <div className="flex justify-between">
        <Button type="submit">Save Note</Button>
        <Button type="button" onClick={onClose} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
