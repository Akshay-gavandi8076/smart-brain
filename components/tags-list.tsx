"use client";
import React from "react";
import { badgeVariants } from "./ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function TagsList({ tags }: { tags: string[] }) {
  const router = useRouter();
  return (
    <div className="flex flex-wrap gap-2">
      {tags?.map((tag) => (
        <button key={tag} className={cn(badgeVariants())}>
          {tag}
        </button>
      ))}
    </div>
  );
}
