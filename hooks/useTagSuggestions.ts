"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";

export function useTagSuggestions(input: string) {
  const allTags = useQuery(api.tags.getTags);

  return useMemo(() => {
    if (!allTags || !input.trim()) return [];
    const q = input.toLowerCase();

    return allTags.filter((t) => t.name.toLowerCase().includes(q)).slice(0, 5);
  }, [allTags, input]);
}
