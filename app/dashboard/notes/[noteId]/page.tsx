"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { DeleteNoteButton } from "./delete-note-button";
import { ArrowLeft, Save, Edit, X, Download } from "lucide-react";
import { btnIconStyles } from "@/styles/styles";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { TagsList } from "@/components/tags-list";
import { splitTags } from "@/lib/utils";
import { generatePDF } from "@/lib/generatePDF";

interface NoteHeaderProps {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  handleDownloadPDF: () => void;
  hasChanges: boolean;
  tags?: string;
  setTitle: (title: string) => void;
  noteId: Id<"notes"> | undefined;
}

function NoteHeader({
  title,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  hasChanges,
  handleDownloadPDF,
  tags,
  setTitle,
  noteId,
}: NoteHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className={btnIconStyles} />
        </Button>

        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-zinc-400 bg-transparent p-1 text-4xl font-bold dark:border-zinc-600"
            placeholder="Enter title"
          />
        ) : (
          <h1 className="text-4xl font-bold">{title}</h1>
        )}
      </div>
      {tags && <TagsList tags={splitTags(tags)} />}
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              onClick={onSave}
              variant="outline"
              className="flex gap-2"
              disabled={!hasChanges}
            >
              <Save className={btnIconStyles} />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              onClick={onCancel}
              variant="secondary"
              className="flex gap-2"
            >
              <X className={btnIconStyles} />
              <span className="hidden sm:inline">Cancel</span>
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onEdit} variant="outline" className="flex gap-2">
              <Edit className={btnIconStyles} />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="flex gap-2"
            >
              <Download className={btnIconStyles} />
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
            <DeleteNoteButton noteId={noteId!} />
          </>
        )}
      </div>
    </div>
  );
}

export default function NotesPage() {
  const { noteId } = useParams() as { noteId?: Id<"notes"> };

  const note = useQuery(api.notes.getNote, noteId ? { noteId } : "skip");
  const updateNote = useMutation(api.notes.updateNote);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setText(note.text);
    }
  }, [note]);

  const hasChanges = title !== note?.title || text !== note?.text;

  const handleSave = async () => {
    if (noteId) {
      await updateNote({ noteId, title, text });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(note?.title || "");
    setText(note?.text || "");
    setIsEditing(false);
  };

  const handleDownloadPDF = () => {
    const tags = splitTags(note?.tags || "");
    generatePDF(title, tags, text);
  };

  return (
    <main className="h-full w-full space-y-8">
      <NoteHeader
        title={title}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        hasChanges={hasChanges}
        handleDownloadPDF={handleDownloadPDF}
        tags={note?.tags}
        setTitle={setTitle}
        noteId={noteId}
      />

      <div className="relative h-[780px] w-full overflow-y-scroll rounded bg-zinc-100 p-4 dark:bg-zinc-900">
        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-full w-full resize-none whitespace-pre-line border border-zinc-400 bg-transparent p-2 dark:border-zinc-600"
            placeholder="Enter note text"
          />
        ) : (
          <div className="whitespace-pre-line pr-8">{text}</div>
        )}
      </div>
    </main>
  );
}
