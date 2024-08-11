"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import ChatPanel from "./chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteDocumentButton } from "./delete-document-button";
import { Button } from "@/components/ui/button";
import { Arrow } from "@radix-ui/react-dropdown-menu";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { btnIconStyles } from "@/styles/styles";

export default function DocumentPage({
  params,
}: {
  params: { documentId: Id<"documents"> };
}) {
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  });

  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <main className="h-full w-full space-y-8">
      {document && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">{document.title}</h1>
            <DeleteDocumentButton documentId={document._id} />
          </div>
          <div className="flex h-[780px] gap-6">
            <div
              className={`${
                isMinimized ? "flex-[1_1_100%]" : "flex-[1_1_50%]"
              } rounded-xl bg-zinc-200 p-4 text-black transition-all duration-300 ease-in-out dark:bg-zinc-800 dark:text-white`}
            >
              {document.documentUrl && (
                <iframe className="h-full w-full" src={document.documentUrl} />
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
                  <ArrowLeftFromLine className={btnIconStyles} />
                ) : (
                  <ArrowRightFromLine className={btnIconStyles} />
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
                      Coming soon...
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
