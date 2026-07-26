"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import DocumentDetailHeader from "./_components/document-detail-header";
import DocumentViewer from "./_components/document-viewer";
import DocumentDetailSidebar from "./_components/document-detail-sidebar";

export default function DocumentPage({
  params,
}: {
  params: { documentId: Id<"documents"> };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [windowHeight, setWindowHeight] = useState(0);

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
    }
  }, [fetchedNotes, toast]);

  const notes =
    fetchedNotes && !(fetchedNotes instanceof Error) ? fetchedNotes : [];

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
      <DocumentDetailHeader document={document} />
      <div className="flex gap-6">
        <DocumentViewer
          document={document}
          isMinimized={isMinimized}
          windowHeight={windowHeight}
        />
        <DocumentDetailSidebar
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
