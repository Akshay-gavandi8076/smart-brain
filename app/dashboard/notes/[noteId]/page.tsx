"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { DeleteNoteButton } from "./delete-note-button";

export default function NotesPage({
  params,
}: {
  params: { noteId: Id<"notes"> };
}) {
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();
  const note = useQuery(api.notes.getNote, {
    noteId,
  });

  return (
    <main className="h-full w-full space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Note Title</h1>
        <DeleteNoteButton noteId={note?._id!} />
      </div>
      <div className="relative h-[780px] w-full overflow-y-scroll rounded bg-zinc-100 p-4 dark:bg-zinc-900">
        <div className="whitespace-pre-line pr-8">{note?.text}</div>
      </div>
    </main>
  );
}
