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
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoadingButton } from "@/components/loading-button";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";

const uploadDocumentFormSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(250, "Title must not exceed 250 characters"),
  file: z.custom<File>((file) => file instanceof File, {
    message: "Invalid file",
  }),
  tags: z.string().optional(),
});

interface UploadDocumentFormProps {
  onDocumentUpload: () => void;
}

export default function UploadDocumentForm({
  onDocumentUpload,
}: UploadDocumentFormProps) {
  const createDocument = useMutation(api.documents.createDocument);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof uploadDocumentFormSchema>>({
    resolver: zodResolver(uploadDocumentFormSchema),
    defaultValues: {
      title: "",
      tags: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof uploadDocumentFormSchema>) => {
    try {
      const url = await generateUploadUrl();

      const result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": values.file.type },
        body: values.file,
      });

      if (!result.ok) {
        throw new Error("Failed to upload the file");
      }

      const { storageId } = await result.json();

      await createDocument({
        title: values.title,
        tags: values.tags,
        fileId: storageId as Id<"_storage">,
      });

      onDocumentUpload();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error uploading document",
        description: "An error occurred while uploading the document.",
      });
    }
  };

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
                <Input placeholder="Expense Report" {...field} />
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
                  placeholder="Enter tags, separated by commas"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel htmlFor="file">File</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept=".txt,.xml,.doc"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton
          isLoading={form.formState.isSubmitting}
          loadingText="Uploading..."
        >
          Upload
        </LoadingButton>
      </form>
    </Form>
  );
}
