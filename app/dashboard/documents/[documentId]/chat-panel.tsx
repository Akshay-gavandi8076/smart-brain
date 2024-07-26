"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { QuestionForm } from "./question-form";
import { useUser } from "@clerk/nextjs";

export default function ChatPanel({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const chats = useQuery(api.chats.getChatsForDocument, { documentId });

  return (
    <div className="flex flex-col gap-2 rounded-xl p-4 dark:bg-zinc-800">
      <div className="h-[650px] space-y-2 overflow-y-auto">
        <div className="rounded bg-zinc-300 p-2 dark:bg-zinc-950">
          AI: Ask any questions using AI about this document below:
        </div>

        {chats?.map((chat) => (
          // eslint-disable-next-line react/jsx-key
          <div
            className={cn(
              {
                "bg-zinc-100 dark:bg-zinc-900": chat.isHuman,
                "cursor-pointer bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900":
                  !chat.isHuman,
                "text-right": chat.isHuman,
              },
              "whitespace-pre-line rounded p-4",
            )}
          >
            {chat.isHuman ? "YOU" : "AI"}: {chat.text}
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <QuestionForm documentId={documentId} />
      </div>
    </div>
  );
}
