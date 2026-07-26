"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { btnIconStyles } from "@/styles/styles";
import { useRouter } from "next/navigation";
import ChatPanel from "../chat-panel";
import NoteSection from "./note-section";

type DocumentWithUrl = Doc<"documents"> & {
  documentUrl: string | null;
};

interface DocumentDetailSidebarProps {
  isMinimized: boolean;
  toggleMinimize: () => void;
  showNoteForm: boolean;
  setShowNoteForm: (show: boolean) => void;
  notes: Doc<"notes">[];
  deleteNote: (params: { noteId: Id<"notes"> }) => Promise<null>;
  document: DocumentWithUrl;
  router: ReturnType<typeof useRouter>;
  windowHeight: number;
}

export default function DocumentDetailSidebar({
  isMinimized,
  toggleMinimize,
  showNoteForm,
  setShowNoteForm,
  notes,
  deleteNote,
  document,
  router,
  windowHeight,
}: DocumentDetailSidebarProps) {
  return (
    <div
      className={`relative rounded-xl transition-[flex-basis] duration-300 ease-in-out ${
        isMinimized ? "basis-10" : "basis-1/2"
      }`}
      style={{ height: windowHeight }}
    >
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

      {!isMinimized && (
        <Tabs defaultValue="chat" className="ml-2 h-full">
          <TabsList className="mb-2 ml-8">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="note">Note</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-0">
            <ChatPanel documentId={document._id} height={windowHeight} />
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
