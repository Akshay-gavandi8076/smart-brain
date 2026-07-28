"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";

const MAX_SUGGESTIONS = 7;

export function useTagSuggestions(input: string) {
  const allTags = useQuery(api.tags.getTags);

  return useMemo(() => {
    const query = input.trim().toLowerCase();
    if (!allTags || !query) return [];

    return allTags
      .filter((tag) => tag.name.toLowerCase().includes(query))
      .slice(0, MAX_SUGGESTIONS);
  }, [allTags, input]);
}
