"use client";

import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/loading-button";
import { Send } from "lucide-react";
import { btnIconStyles } from "@/styles/styles";

const questionFormSchema = z.object({
  text: z
    .string()
    .min(2, "Question must be at least 2 characters")
    .max(250, "Question must not exceed 250 characters"),
});

interface QuestionFormProps {
  documentId: Id<"documents">;
}

export function QuestionForm({ documentId }: QuestionFormProps) {
  const askQuestion = useAction(api.documents.askQuestion);

  const form = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof questionFormSchema>) => {
    try {
      await askQuestion({ question: values.text, documentId });
      form.reset();
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-1 gap-1"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1 rounded-md bg-zinc-200 dark:bg-zinc-950">
              <FormControl>
                <Input
                  placeholder="Ask any questions using AI about this document:"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton isLoading={form.formState.isSubmitting} size="icon">
          <Send className={btnIconStyles} />
        </LoadingButton>
      </form>
    </Form>
  );
}
