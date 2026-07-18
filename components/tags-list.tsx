"use client";

import { badgeVariants } from "./ui/badge";
import { cn } from "@/lib/utils";

interface TagsListProps {
  tags: string[];
}

export function TagsList({ tags }: TagsListProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className={cn(badgeVariants())}>
          {tag}
        </span>
      ))}
    </div>
  );
}
