"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  jobFormSchema,
  JobFormValues,
  normalizeOptionalField,
  STATUS_OPTIONS,
} from "@/lib/jobs";

export default function CreateJobForm({
  onJobCreated,
}: {
  onJobCreated: () => void;
}) {
  const createJob = useMutation(api.jobs.createJob);
  const { toast } = useToast();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      company: "",
      title: "",
      status: "applied",
      link: "",
      location: "",
      notes: "",
    },
  });

  const currentStatus = form.watch("status");
  const currentLabel =
    STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label ?? "Applied";

  const onSubmit = async (values: JobFormValues) => {
    try {
      await createJob({
        company: values.company.trim(),
        title: values.title.trim(),
        status: values.status,
        link: normalizeOptionalField(values.link),
        location: normalizeOptionalField(values.location),
        notes: normalizeOptionalField(values.notes),
      });

      onJobCreated();
      form.reset();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error creating job",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Google" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role / Title</FormLabel>
              <FormControl>
                <Input placeholder="Frontend Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {currentLabel}
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[var(--radix-dropdown-menu-trigger-width)]"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        onClick={() => field.onChange(opt.value)}
                      >
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Link</FormLabel>
              <FormControl>
                <Input placeholder="https://company.com/job/123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Remote / Berlin / Pune" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="hidden sm:block" />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Anything important..."
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
