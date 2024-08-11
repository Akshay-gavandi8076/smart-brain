"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { QuestionForm } from "./question-form";
import { useUser } from "@clerk/nextjs";
import { Bot } from "lucide-react"; // Import the Bot icon
import Image from "next/image";

export default function ChatPanel({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const chats = useQuery(api.chats.getChatsForDocument, { documentId });

  const { user } = useUser();

  return (
    <div className="flex flex-col gap-2 rounded-xl p-2 dark:bg-zinc-800">
      <div className="h-[670px] space-y-2 overflow-y-auto">
        {/* <div className="flex justify-center">
          <div className="flex w-2/4 justify-center rounded-xl bg-zinc-300 p-2 font-semibold dark:bg-zinc-900">
            Ask AI copilot:
          </div>
        </div> */}

        {chats?.map((chat) => (
          // eslint-disable-next-line react/jsx-key
          <div
            className={cn("flex cursor-pointer items-start gap-3 rounded p-4", {
              "flex-row-reverse justify-end": chat.isHuman,
              "bg-transparent": !chat.isHuman,
            })}
          >
            {chat.isHuman ? (
              <Image
                src={user?.imageUrl!}
                alt="User Profile"
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-900">
                <Bot className="h-7 w-7 text-blue-500" />
              </div>
            )}

            <div
              className={cn(
                {
                  "bg-zinc-100 text-right dark:bg-zinc-900": chat.isHuman,
                  "bg-gray-200 hover:bg-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-900":
                    !chat.isHuman,
                },
                "flex-1 whitespace-pre-line rounded-xl p-3",
              )}
            >
              {chat.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <QuestionForm documentId={documentId} />
      </div>
    </div>
  );
}
