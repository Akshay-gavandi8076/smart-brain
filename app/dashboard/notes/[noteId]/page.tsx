"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import {
  ArrowLeft,
  Save,
  Edit,
  X,
  Download,
  FileText,
  PlusIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { badgeVariants } from "@/components/ui/badge";
import { cn, splitTags } from "@/lib/utils";
import { generatePDF } from "@/lib/generatePDF";
import { DeleteNoteButton } from "./delete-note-button";
import { btnIconStyles } from "@/styles/styles";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useTagSuggestions } from "@/hooks/useTagSuggestions";

export default function NotesPage() {
  const { noteId } = useParams() as { noteId: Id<"notes"> };
  const router = useRouter();

  const note = useQuery(api.notes.getNote, { noteId });
  const document = useQuery(
    api.documents.getDocument,
    note?.documentId ? { documentId: note.documentId } : "skip",
  );

  const updateNote = useMutation(api.notes.updateNote);
  const addOrIncrementTag = useMutation(api.tags.addOrIncrementTag);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  /** Which tag input is currently active (editing existing tag) */
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const activeInputValue =
    activeTagIndex !== null ? tags[activeTagIndex] : newTag;

  const suggestions = useTagSuggestions(activeInputValue);
  const existingTags = useQuery(api.tags.getTags) || [];

  /* -----------------------------
     Sync note → local state
  ------------------------------ */
  useEffect(() => {
    if (!note) return;
    setTitle(note.title);
    setText(note.text);
    setTags(splitTags(note.tags || "").filter(Boolean));
  }, [note]);

  if (!note) return null;

  const hasChanges =
    title !== note.title ||
    text !== note.text ||
    tags.join(",") !== (note.tags || "");

  const handleSave = async () => {
    const normalizedTags = tags
      .map((t) => t.replace(/^"+|"+$/g, "").trim())
      .filter(Boolean);

    // Fetch existing tags for current user
    const existingTagNames = existingTags.map((t) => t.name);

    // Only add truly new tags
    const newTags = normalizedTags.filter((t) => !existingTagNames.includes(t));
    if (newTags.length > 0) {
      await Promise.all(newTags.map((tag) => addOrIncrementTag({ name: tag }))); // call directly
    }

    await updateNote({
      noteId: note._id,
      title,
      text,
      tags: normalizedTags.join(","),
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(note.title);
    setText(note.text);
    setTags(splitTags(note.tags || ""));
    setNewTag("");
    setActiveTagIndex(null);
    setIsEditing(false);
  };

  const addTag = (value?: string) => {
    const tag = (value ?? newTag).trim();
    if (!tag || tags.includes(tag)) return;
    setTags([...tags, tag]);
    setNewTag("");
  };

  const updateTagAtIndex = (index: number, value: string) => {
    const next = [...tags];
    next[index] = value;
    setTags(next);
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  /* -----------------------------
     Render
  ------------------------------ */
  return (
    <main className="flex h-full w-full">
      <div className="flex flex-1 flex-col">
        {/* HEADER */}
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
                          onClick={() =>
                            document &&
                            router.push(
                              `/dashboard/documents/${note.documentId}`,
                            )
                          }
                          className={cn(
                            "rounded-md p-1 transition hover:bg-accent",
                            !document && "cursor-not-allowed opacity-50",
                          )}
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
                    onClick={() => generatePDF(title, tags, text)}
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

          {/* TAGS */}
          {(tags.length > 0 || isEditing) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className={cn(
                    badgeVariants(),
                    "relative flex items-center gap-1",
                  )}
                >
                  {isEditing ? (
                    <>
                      <input
                        value={tag}
                        onFocus={() => setActiveTagIndex(index)}
                        onBlur={() => setActiveTagIndex(null)}
                        onChange={(e) =>
                          updateTagAtIndex(index, e.target.value)
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && e.currentTarget.blur()
                        }
                        className="bg-transparent text-sm outline-none"
                      />
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />

                      {activeTagIndex === index && suggestions.length > 0 && (
                        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-xl border bg-zinc-950 p-2 text-white">
                          {suggestions.map((s) => (
                            <button
                              key={s._id}
                              onMouseDown={() => {
                                updateTagAtIndex(index, s.name);
                                setActiveTagIndex(null);
                              }}
                              className="block w-full px-3 py-2 text-left text-sm hover:bg-accent"
                            >
                              {s.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <span>{tag}</span>
                  )}
                </div>
              ))}

              {isEditing && (
                <div className="relative flex items-center gap-1 rounded-full border border-zinc-400 px-2 py-1 dark:border-zinc-600">
                  <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    placeholder="Add tag"
                    className="bg-transparent text-sm outline-none"
                  />
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={() => addTag()}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>

                  {newTag && suggestions.length > 0 && (
                    <div className="absolute left-3 top-full z-50 mt-2 w-48 rounded-xl border bg-background p-2 shadow">
                      {suggestions.map((s) => (
                        <button
                          key={s._id}
                          onMouseDown={() => addTag(s.name)}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-accent"
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto bg-zinc-100 p-4 dark:bg-zinc-900">
          {isEditing ? (
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-full resize-none bg-transparent"
            />
          ) : (
            <div className="whitespace-pre-line">{text}</div>
          )}
        </div>
      </div>
    </main>
  );
}
