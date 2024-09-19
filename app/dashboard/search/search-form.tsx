"use client";

import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
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
import { Search } from "lucide-react";
import { btnIconStyles } from "@/styles/styles";

const searchFormSchema = z.object({
  search: z
    .string()
    .min(2, "Search term must be at least 2 characters")
    .max(250, "Search term must not exceed 250 characters"),
});

interface SearchFormProps {
  setResults: (notes: typeof api.search.searchAction._returnType) => void;
}

export function SearchForm({ setResults }: SearchFormProps) {
  const searchAction = useAction(api.search.searchAction);

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      search: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof searchFormSchema>) => {
    try {
      const searchResults = await searchAction({ search: values.search });
      setResults(searchResults);
      form.reset();
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-1 gap-1"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Search over all your notes and documents using vector searching"
                  {...field}
                  aria-label="Search"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isLoading={form.formState.isSubmitting}
          loadingText="Searching..."
          aria-label="Search button"
        >
          <Search className={btnIconStyles} />
          <span className="hidden sm:inline">Search</span>
        </LoadingButton>
      </form>
    </Form>
  );
}
