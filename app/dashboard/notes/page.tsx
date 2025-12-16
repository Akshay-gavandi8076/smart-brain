"use client";

import { useQuery } from "convex/react";
import CreateNoteButton from "./create-note-button";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { NoteCard } from "./note-card";
import { CardSkeleton } from "@/components/CardSkeleton";

export default function Home() {
  const notes = useQuery(api.notes.getNotes);

  return (
    <main className="w-full space-y-8">
      <Header />

      {notes ? (
        notes.length === 0 ? (
          <EmptyState />
        ) : (
          <NotesGrid notes={notes} />
        )
      ) : (
        <LoadingState />
      )}
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold sm:text-4xl">Notes</h1>
      <CreateNoteButton />
    </header>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

function NotesGrid({ notes }: { notes: Doc<"notes">[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <Image src="/documents.svg" width="200" height="200" alt="No documents" />
      <h2 className="text-2xl font-bold sm:text-2xl md:text-4xl lg:text-4xl">
        You have no notes
      </h2>
      <CreateNoteButton />
    </div>
  );
}
