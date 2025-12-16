"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { DeleteNoteButton } from "./delete-note-button";
import { ArrowLeft, Save, Edit, X, Download } from "lucide-react";
import { btnIconStyles } from "@/styles/styles";
import { Button } from "@/components/ui/button";
import { TagsList } from "@/components/tags-list";
import { splitTags } from "@/lib/utils";
import { generatePDF } from "@/lib/generatePDF";
import { api } from "@/convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";

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

const NoteHeader: React.FC<NoteHeaderProps> = ({
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
}) => {
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
};

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
    <main className="flex h-screen w-full">
      <div className="flex flex-1 flex-col">
        <div className="relative flex flex-1 flex-col">
          <div className="sticky top-0 z-20 bg-zinc-50 p-4 shadow-md dark:bg-zinc-950">
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
          </div>

          <div className="flex-1 overflow-auto rounded-b bg-zinc-100 p-4 dark:bg-zinc-900">
            {isEditing ? (
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-full w-full resize-none whitespace-pre-line bg-transparent outline-none"
                placeholder="Enter note text"
              />
            ) : (
              <div className="min-h-full w-full whitespace-pre-line">
                {text}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
