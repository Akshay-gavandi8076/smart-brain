"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import ChatPanel from "./chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteDocumentButton } from "./delete-document-button";

export default function DocumentPage({
  params,
}: {
  params: { documentId: Id<"documents"> };
}) {
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  });

  return (
    <main className="h-full w-full space-y-8">
      {!document && (
        <div className="space-y-10">
          <div>
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-[500px]" />
        </div>
      )}

      {document && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">{document.title}</h1>

            <DeleteDocumentButton documentId={document._id} />
          </div>
          <div className="flex gap-12">
            <Tabs defaultValue="document" className="w-full">
              <TabsList className="mb-2">
                <TabsTrigger value="document">Document</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>
              <TabsContent value="document">
                <div className="h-[650px] flex-1 rounded-xl bg-zinc-600 p-4">
                  {document.documentUrl && (
                    <iframe
                      className="h-full w-full"
                      src={document.documentUrl}
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="chat">
                <ChatPanel documentId={document._id} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </main>
  );
}
