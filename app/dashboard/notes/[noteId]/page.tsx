"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function NotesPage() {
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();
  const note = useQuery(api.notes.getNote, {
    noteId,
  });

  if (!note) {
    return null;
  }

  return (
    <div className="relative h-[780px] w-full overflow-y-scroll rounded bg-zinc-100 p-4 dark:bg-zinc-900">
      <div className="whitespace-pre-line pr-8">{note?.text}</div>
    </div>
  );
}
