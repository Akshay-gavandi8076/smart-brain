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
import { LoadingButton } from "@/components/shared/loading-button";
import { Search, X } from "lucide-react";
import { btnIconStyles } from "@/styles/styles";
import { toast } from "@/components/ui/use-toast";

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
    } catch (error) {
      console.error("Error during search:", error);

      toast({
        title: "Search unavailable",
        description: "AI search service is temporarily unavailable.",
        variant: "destructive",
      });
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
                <div className="relative">
                  <Input
                    placeholder="Search over all your notes and documents using vector searching"
                    {...field}
                    aria-label="Search"
                    className="pr-10"
                  />

                  {field.value && (
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue("search", "");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
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
