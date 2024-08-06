"use client";

import { useQuery } from "convex/react";
import CreateNoteButton from "./create-note-button";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteNoteButton } from "./[noteId]/delete-note-button";

export default function NotesLayout({ children }: { children: ReactNode }) {
  const notes = useQuery(api.notes.getNotes);
  const { noteId } = useParams<{ noteId: Id<"notes"> }>();

  return (
    <main className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-4xl md:text-4xl lg:text-4xl">
          Notes
        </h1>

        <CreateNoteButton />
      </div>

      {!notes && (
        <div className="flex gap-12">
          <div className="w-[200px] space-y-4">
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
          </div>

          <div className="flex-1">
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      )}

      {notes?.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-6 py-12">
          <Image
            src="/documents.svg"
            width="200"
            height="200"
            alt="No documents"
          />
          <h2 className="text-2xl font-bold sm:text-2xl md:text-4xl lg:text-4xl">
            You have no notes
          </h2>

          <CreateNoteButton />
        </div>
      )}

      {notes && notes?.length > 0 && (
        <div className="flex gap-4">
          <ul className="w-[300px] space-y-2">
            {notes?.map((note) => (
              <li
                key={note._id}
                className={cn(
                  "flex items-center gap-2 rounded border p-3 text-base font-light hover:bg-accent hover:text-accent-foreground",
                  {
                    "bg-accent": note._id === noteId,
                  },
                )}
              >
                <Link href={`/dashboard/notes/${note._id}`}>
                  {note.text.substring(0, 30) + "..."}
                </Link>
                <DeleteNoteButton noteId={note?._id} />
              </li>
            ))}
          </ul>

          <div className="w-full">{children}</div>
        </div>
      )}
    </main>
  );
}
