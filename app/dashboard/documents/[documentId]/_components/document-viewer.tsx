"use client";

import { Doc } from "@/convex/_generated/dataModel";

type DocumentWithUrl = Doc<"documents"> & {
  documentUrl: string | null;
};

interface DocumentViewerProps {
  document: DocumentWithUrl;
  isMinimized: boolean;
  windowHeight: number;
}

export default function DocumentViewer({
  document,
  isMinimized,
  windowHeight,
}: DocumentViewerProps) {
  return (
    <div
      className={`mt-6 transition-all duration-300 ease-in-out ${
        isMinimized ? "w-full" : "w-1/2"
      } rounded-xl bg-zinc-200 p-2 dark:bg-zinc-800`}
      style={{
        height: windowHeight,
        overflow: "auto",
      }}
    >
      {document.documentUrl && (
        <iframe
          className="h-full w-full rounded-xl"
          style={{
            zoom: 1.5,
          }}
          src={document.documentUrl}
          title={document.title}
        />
      )}
    </div>
  );
}
