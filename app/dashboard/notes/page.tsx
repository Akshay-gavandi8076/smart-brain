"use client";
import { useQuery } from "convex/react";
import CreateNoteButton from "./create-note-button";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteCard } from "./note-card";
import { Card } from "@/components/ui/card";

export default function Home() {
  const notes = useQuery(api.notes.getNotes);

  return (
    <main className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-4xl md:text-4xl lg:text-4xl">
          Notes
        </h1>

        <CreateNoteButton />
      </div>

      {!notes && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {new Array(4).fill(0).map((_, i) => (
            <Card
              key={i}
              className="flex h-[150px] flex-col justify-between p-6"
            >
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[30px] w-[80px] rounded" />
            </Card>
          ))}
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
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {notes?.map((note) => <NoteCard key={note._id} note={note} />)}
        </div>
      )}
    </main>
  );
}
