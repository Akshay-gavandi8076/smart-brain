"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/loading-button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const createNoteFormSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(250, "Title must not exceed 250 characters"),
  text: z.string().min(2, "Description must be at least 2 characters"),
  tags: z.string().optional(),
});

export default function CreateNoteForm({
  onNoteCreated,
}: {
  onNoteCreated: () => void;
}) {
  const createNote = useMutation(api.notes.createNote);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createNoteFormSchema>>({
    resolver: zodResolver(createNoteFormSchema),
    defaultValues: {
      title: "",
      text: "",
      tags: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createNoteFormSchema>) {
    try {
      await createNote({
        title: values.title,
        text: values.text,
        tags: values.tags,
      });

      onNoteCreated();
      form.reset();
    } catch (error) {
      console.error("Error creating a note:", error);

      toast({
        title: "Error creating note",
        description: "An error occurred while creating the note.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input id="title" placeholder="Expense Report" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="text">Description</FormLabel>
              <FormControl>
                <Textarea
                  id="text"
                  rows={8}
                  placeholder="Your note"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="tags">Tags</FormLabel>
              <FormControl>
                <Input
                  id="tags"
                  placeholder="Enter tags, separated by commas"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          isLoading={form.formState.isSubmitting}
          loadingText="Creating..."
        >
          Create
        </LoadingButton>
      </form>
    </Form>
  );
}
