"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Eye, Trash } from "lucide-react";
import { btnIconStyles } from "@/styles/styles";
import { htmlToText } from "@/lib/html";
import NoteForm from "../document-note-form";
import { useRouter } from "next/navigation";

type DocumentWithUrl = Doc<"documents"> & {
  documentUrl: string | null;
};

interface NoteSectionProps {
  showNoteForm: boolean;
  setShowNoteForm: (show: boolean) => void;
  notes: Doc<"notes">[];
  deleteNote: (params: { noteId: Id<"notes"> }) => Promise<null>;
  document: DocumentWithUrl;
  router: ReturnType<typeof useRouter>;
}

export default function NoteSection({
  showNoteForm,
  setShowNoteForm,
  notes,
  deleteNote,
  document,
  router,
}: NoteSectionProps) {
  return (
    <div className="max-h-[730px] w-full overflow-y-auto rounded-xl bg-zinc-50 p-4 text-black dark:bg-zinc-800 dark:text-white">
      {showNoteForm ? (
        <NoteForm
          documentId={document._id}
          documentTitle={document.title}
          onClose={() => setShowNoteForm(false)}
          onNoteCreated={() => setShowNoteForm(false)}
        />
      ) : (
        <Button variant="default" onClick={() => setShowNoteForm(true)}>
          Add Note
        </Button>
      )}

      <div className="mt-4">
        {notes.length > 0 ? (
          notes.map((note) => {
            const preview = htmlToText(note.text);

            return (
              <div
                key={note._id}
                className="mb-2 flex items-start justify-between rounded-lg bg-zinc-100 p-4 shadow-md dark:bg-zinc-900"
              >
                <p className="line-clamp-3 pr-1 text-sm text-muted-foreground">
                  {preview.length > 160
                    ? `${preview.slice(0, 160)}...`
                    : preview}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push(`/dashboard/notes/${note._id}`)}
                  >
                    <Eye className={btnIconStyles} />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteNote({ noteId: note._id })}
                  >
                    <Trash className={btnIconStyles} />
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No notes available</p>
        )}
      </div>
    </div>
  );
}
