"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { DeleteNoteButton } from "./delete-note-button";
import {
  ArrowLeft,
  Save,
  Edit,
  X,
  Download,
  FileText,
  PlusIcon,
} from "lucide-react";
import { btnIconStyles } from "@/styles/styles";
import { Button } from "@/components/ui/button";
import { splitTags } from "@/lib/utils";
import { generatePDF } from "@/lib/generatePDF";
import { api } from "@/convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { badgeVariants } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NotesPage() {
  const { noteId } = useParams() as { noteId?: Id<"notes"> };
  const router = useRouter();

  const note = useQuery(api.notes.getNote, noteId ? { noteId } : "skip");
  const updateNote = useMutation(api.notes.updateNote);

  const document = useQuery(
    api.documents.getDocument,
    note?.documentId ? { documentId: note.documentId } : "skip",
  );

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Helper to clean empty tags
  const cleanTags = (tagsStr?: string) =>
    splitTags(tagsStr || "").filter((t) => t.trim() !== "");

  useEffect(() => {
    if (!note) return;
    setTitle(note.title);
    setText(note.text);
    setTags(cleanTags(note.tags));
  }, [note]);

  if (!note) return null;

  const hasChanges =
    title !== note.title || text !== note.text || tags.join(",") !== note.tags;

  const handleSave = async () => {
    await updateNote({
      noteId: note._id,
      title,
      text,
      tags: tags.join(","),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(note.title);
    setText(note.text);
    setTags(cleanTags(note.tags));
    setNewTag("");
    setIsEditing(false);
  };

  const addTag = () => {
    const value = newTag.trim();
    if (!value || tags.includes(value)) return;
    setTags([...tags, value]);
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleDownloadPDF = () => generatePDF(title, tags, text);

  return (
    <main className="flex h-full w-full">
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-zinc-50 p-4 shadow-md dark:bg-zinc-950">
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

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-zinc-400 bg-transparent p-1 text-4xl font-bold dark:border-zinc-600"
                  />
                ) : (
                  <h1 className="text-4xl font-bold">{title}</h1>
                )}

                {note.documentId && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            if (document) {
                              router.push(
                                `/dashboard/documents/${note.documentId}`,
                              );
                            }
                          }}
                          className={cn(
                            "rounded-md p-1 transition hover:bg-accent",
                            !document && "cursor-not-allowed opacity-50",
                          )}
                          aria-label="Linked document"
                        >
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {document
                          ? "Created from a document"
                          : "Document no longer exists"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    variant="outline"
                    className="flex gap-2"
                  >
                    <Save className={btnIconStyles} />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="secondary"
                    className="flex gap-2"
                  >
                    <X className={btnIconStyles} />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex gap-2"
                  >
                    <Edit className={btnIconStyles} />
                    Edit
                  </Button>
                  <Button
                    onClick={handleDownloadPDF}
                    variant="outline"
                    className="flex gap-2"
                  >
                    <Download className={btnIconStyles} />
                    PDF
                  </Button>
                  <DeleteNoteButton noteId={note._id} />
                </>
              )}
            </div>
          </div>

          {/* Tags Section */}
          {(tags.length > 0 || isEditing) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {/* Existing tags */}
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className={cn(
                    badgeVariants(),
                    "flex items-center gap-1",
                    isEditing ? "cursor-text" : "",
                  )}
                >
                  {isEditing ? (
                    <>
                      <input
                        value={tag}
                        onChange={(e) => {
                          const next = [...tags];
                          next[index] = e.target.value;
                          setTags(next);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.currentTarget.blur();
                        }}
                        className="bg-transparent text-sm outline-none"
                      />
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </>
                  ) : (
                    <span>{tag}</span>
                  )}
                </div>
              ))}

              {/* Add new tag input with button (kept exactly as you wanted) */}
              {isEditing && (
                <div className="flex items-center gap-1 rounded-full border border-zinc-400 px-2 py-1 dark:border-zinc-600">
                  <input
                    autoFocus
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    placeholder="Add tag"
                    className="w-25 bg-transparent text-sm outline-none"
                  />
                  <Button className="rounded-full" size="sm" onClick={addTag}>
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-zinc-100 p-4 dark:bg-zinc-900">
          {isEditing ? (
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-full resize-none whitespace-pre-line bg-transparent"
            />
          ) : (
            <div className="whitespace-pre-line">{text}</div>
          )}
        </div>
      </div>
    </main>
  );
}
