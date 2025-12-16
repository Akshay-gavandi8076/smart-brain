"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { Id, Doc } from "@/convex/_generated/dataModel";
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
import { useRouter } from "next/navigation";
import { TagsList } from "@/components/tags-list";
import { splitTags } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import NoteForm from "./document-note-form";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton"; // assuming you have a Skeleton component

type DocumentWithUrl = Doc<"documents"> & { documentUrl: string | null };

export default function DocumentPage({
  params,
}: {
  params: { documentId: Id<"documents"> };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [windowHeight, setWindowHeight] = useState<number>(0);

  // -----------------------------
  // Persist Sidebar State
  // -----------------------------
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebarMinimized") === "true";
    }
    return false;
  });

  const toggleMinimize = () => {
    setIsMinimized((prev) => {
      localStorage.setItem("sidebarMinimized", String(!prev));
      return !prev;
    });
  };

  useEffect(() => {
    function updateHeight() {
      setWindowHeight(window.innerHeight - 120); // subtract header + some padding
    }

    updateHeight(); // initial height
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notes, setNotes] = useState<Doc<"notes">[]>([]);

  // -----------------------------
  // Fetch document with loading & error handling
  // -----------------------------
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  });

  useEffect(() => {
    if (!document) return;
    if (document instanceof Error) {
      toast({
        title: "Error fetching document",
        description: document.message,
        variant: "destructive",
      });
    }
  }, [document, toast]);

  // -----------------------------
  // Fetch notes with loading & error handling
  // -----------------------------
  const fetchedNotes = useQuery(api.notes.getNotesByDocumentId, {
    documentId: params.documentId,
  });

  const deleteNote = useMutation(api.notes.deleteNote);

  useEffect(() => {
    if (!fetchedNotes) return;
    if (fetchedNotes instanceof Error) {
      toast({
        title: "Error fetching notes",
        description: fetchedNotes.message,
        variant: "destructive",
      });
    } else {
      setNotes(fetchedNotes);
    }
  }, [fetchedNotes, toast]);

  // -----------------------------
  // Loading state
  // -----------------------------
  if (!document) {
    return (
      <main className="h-full w-full space-y-8 p-4">
        <Skeleton className="mb-4 h-10 w-1/2" />
        <div className="flex gap-6">
          <Skeleton className="h-[780px] w-1/2 rounded-xl" />
          <Skeleton className="h-[780px] w-1/2 rounded-xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-full w-full flex-col space-y-8 overflow-hidden">
      <Header document={document} onBack={() => router.back()} />
      <div className="flex gap-6">
        <DocumentViewer
          document={document}
          isMinimized={isMinimized}
          windowHeight={windowHeight}
        />
        <Sidebar
          isMinimized={isMinimized}
          toggleMinimize={toggleMinimize}
          showNoteForm={showNoteForm}
          setShowNoteForm={setShowNoteForm}
          notes={notes}
          deleteNote={deleteNote}
          document={document}
          router={router}
          windowHeight={windowHeight}
        />
      </div>
    </main>
  );
}

// -----------------------------
// Header
// -----------------------------
function Header({
  document,
  onBack,
}: {
  document: DocumentWithUrl;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className={btnIconStyles} />
        </Button>
        <h1 className="text-4xl font-bold">{document.title}</h1>
      </div>
      {document.tags && <TagsList tags={splitTags(document.tags || "")} />}
      <DeleteDocumentButton documentId={document._id} />
    </div>
  );
}

// -----------------------------
// Document Viewer
// -----------------------------
function DocumentViewer({
  document,
  isMinimized,
  windowHeight,
}: {
  document: DocumentWithUrl;
  isMinimized: boolean;
  windowHeight: number;
}) {
  return (
    <div
      className={`mt-6 transition-all duration-300 ease-in-out ${
        isMinimized ? "w-full" : "w-1/2"
      } rounded-xl bg-zinc-200 p-2 dark:bg-zinc-800`}
      style={{ height: windowHeight, overflow: "auto" }}
    >
      {document.documentUrl && (
        <iframe
          className="h-full w-full rounded-xl"
          style={{
            zoom: 1.5,
          }}
          src={document.documentUrl}
        />
      )}
    </div>
  );
}

// -----------------------------
// Sidebar
// -----------------------------
function Sidebar({
  isMinimized,
  toggleMinimize,
  showNoteForm,
  setShowNoteForm,
  notes,
  deleteNote,
  document,
  router,
  windowHeight,
}: {
  isMinimized: boolean;
  toggleMinimize: () => void;
  showNoteForm: boolean;
  setShowNoteForm: (show: boolean) => void;
  notes: Doc<"notes">[];
  deleteNote: (params: { noteId: Id<"notes"> }) => Promise<null>;
  document: DocumentWithUrl;
  router: ReturnType<typeof useRouter>;
  windowHeight: number;
}) {
  return (
    <div
      className={`relative rounded-xl transition-[flex-basis] duration-300 ease-in-out ${
        isMinimized ? "basis-10" : "basis-1/2"
      }`}
      style={{ height: windowHeight }}
    >
      {/* Minimize/Expand Button */}
      <Button
        className="absolute z-10 rounded-xl"
        onClick={toggleMinimize}
        variant="outline"
        size="icon"
        aria-label={isMinimized ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isMinimized ? (
          <ArrowLeftFromLine className={btnIconStyles} />
        ) : (
          <ArrowRightFromLine className={btnIconStyles} />
        )}
      </Button>

      {/* Sidebar content */}
      {!isMinimized && (
        <Tabs defaultValue="chat" className="ml-2 h-full">
          <TabsList className="mb-2 ml-8">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="note">Note</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="h-full">
            <div className="flex h-full flex-col overflow-auto p-2">
              <ChatPanel documentId={document._id} />
            </div>
          </TabsContent>

          <TabsContent value="note" className="flex h-full flex-col p-2">
            <NoteSection
              showNoteForm={showNoteForm}
              setShowNoteForm={setShowNoteForm}
              notes={notes}
              deleteNote={deleteNote}
              document={document}
              router={router}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// -----------------------------
// Note Section
// -----------------------------
function NoteSection({
  showNoteForm,
  setShowNoteForm,
  notes,
  deleteNote,
  document,
  router,
}: {
  showNoteForm: boolean;
  setShowNoteForm: (show: boolean) => void;
  notes: Doc<"notes">[];
  deleteNote: (params: { noteId: Id<"notes"> }) => Promise<null>;
  document: DocumentWithUrl;
  router: ReturnType<typeof useRouter>;
}) {
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
          notes.map((note) => (
            <div
              key={note._id}
              className="mb-2 flex justify-between rounded-lg bg-zinc-100 p-4 shadow-md dark:bg-zinc-900"
            >
              <p>{note.text}</p>
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
          ))
        ) : (
          <p>No notes available</p>
        )}
      </div>
    </div>
  );
}
