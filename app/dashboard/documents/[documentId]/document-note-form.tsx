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
import { useState } from "react";

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
  onNoteCreated: () => void;
}) {
  const createNote = useMutation(api.notes.createNote);
  const [submitting, setSubmitting] = useState(false); // <-- new state

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
    if (submitting) return; // prevent multiple submissions
    setSubmitting(true);

    try {
      await createNote({
        title: documentTitle,
        text: values.text,
        tags: values.tags,
        documentId,
      });
      onNoteCreated();
      onClose();
      reset();
    } catch (error) {
      console.error("Failed to create note", error);
    } finally {
      setSubmitting(false); // reset after success/failure
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textarea
        placeholder="Write your note here"
        {...register("text")}
        className={`w-full bg-zinc-100 dark:bg-zinc-950 ${
          errors.text ? "border-red-500" : ""
        } resize-none`}
        rows={8}
        disabled={submitting} // disable textarea while submitting
      />
      {errors.text && <p className="text-red-500">{errors.text.message}</p>}

      <Input
        type="text"
        placeholder="Tags (comma separated)"
        {...register("tags")}
        className="bg-zinc-100 dark:bg-zinc-950"
        disabled={submitting} // disable input while submitting
      />
      <div className="flex justify-between">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Note"} {/* Show saving state */}
        </Button>
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
