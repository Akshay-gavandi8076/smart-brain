"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import ChatPanel from "./chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteDocumentButton } from "./delete-document-button";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Eye,
  Trash,
} from "lucide-react";
import { btnIconStyles } from "@/styles/styles";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { TagsList } from "@/components/tags-list";
import { splitTags } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import NoteForm from "./document-note-form";

export default function DocumentPage({
  params,
}: {
  params: { documentId: Id<"documents"> };
}) {
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  });
  const deleteNote = useMutation(api.notes.deleteNote);

  const [isMinimized, setIsMinimized] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const router = useRouter();

  const fetchedNotes = useQuery(api.notes.getNotesByDocumentId, {
    documentId: params.documentId,
  });

  useEffect(() => {
    if (fetchedNotes) {
      setNotes(fetchedNotes);
    }
  }, [fetchedNotes]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <main className="h-full w-full space-y-8">
      {document && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <ArrowLeft className={btnIconStyles} />
              </Button>
              <h1 className="text-4xl font-bold">{document.title}</h1>
            </div>
            {document.tags && (
              <TagsList tags={splitTags(document.tags || "")} />
            )}
            <DeleteDocumentButton documentId={document._id} />
          </div>
          <div className="flex h-[780px] gap-6">
            <div
              className={`${
                isMinimized ? "flex-[1_1_100%]" : "flex-[1_1_50%]"
              } rounded-xl bg-zinc-200 p-2 transition-all duration-300 ease-in-out dark:bg-zinc-800 dark:text-white`}
            >
              {document.documentUrl && (
                <iframe
                  className="h-full w-full rounded-xl"
                  src={document.documentUrl}
                />
              )}
            </div>

            <div
              className={`${
                isMinimized
                  ? "w-8 translate-x-full"
                  : "flex-[1_1_50%] translate-x-0"
              } relative h-full rounded-xl transition-all duration-500 ease-linear`}
            >
              <Button
                className="absolute -left-4 rounded-xl transition-all duration-300 ease-linear"
                onClick={toggleMinimize}
                variant="outline"
                size="icon"
              >
                {isMinimized ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <ArrowLeftFromLine className={btnIconStyles} />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Open AI Copilot</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger>
                      <ArrowRightFromLine className={btnIconStyles} />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Close AI Copilot</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </Button>
              {!isMinimized && (
                <Tabs defaultValue="chat">
                  <TabsList className="mb-2 ml-8">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="note">Note</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chat">
                    <ChatPanel documentId={document._id} />
                  </TabsContent>
                  <TabsContent value="note">
                    <div className="h-full w-full rounded-xl bg-zinc-200 p-4 text-black dark:bg-zinc-800 dark:text-white">
                      {showNoteForm ? (
                        <NoteForm
                          documentId={document._id}
                          documentTitle={document.title}
                          onClose={() => {
                            setShowNoteForm(false);
                          }}
                          onNoteCreated={function (note: any): void {
                            throw new Error("Function not implemented.");
                          }}
                        />
                      ) : (
                        <Button
                          variant="default"
                          onClick={() => setShowNoteForm(true)}
                        >
                          Add Note
                        </Button>
                      )}
                      <div className="mt-4">
                        {notes.length > 0 ? (
                          notes.map((note) => (
                            <div
                              key={note._id}
                              className="mb-2 flex justify-between rounded-lg bg-zinc-200 p-4 shadow-md dark:bg-zinc-900"
                            >
                              <p>{note.text}</p>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    router.push(`/dashboard/notes/${note._id}`)
                                  }
                                >
                                  <Eye className={btnIconStyles} />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() =>
                                    deleteNote({ noteId: note._id })
                                  }
                                >
                                  <Trash className={btnIconStyles} />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No notes available</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
