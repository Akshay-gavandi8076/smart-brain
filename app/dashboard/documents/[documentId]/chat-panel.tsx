"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { QuestionForm } from "./question-form";
import { useUser } from "@clerk/nextjs";
import { Bot, Copy, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ChatPanel({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const chats = useQuery(api.chats.getChatsForDocument, { documentId });
  const { user } = useUser();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl p-2 dark:bg-zinc-800">
      <div
        ref={chatContainerRef}
        className="h-[670px] space-y-2 overflow-y-auto"
      >
        {chats?.map((chat) => (
          // eslint-disable-next-line react/jsx-key
          <div
            className={cn("relative flex items-start gap-3 rounded p-4", {
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

            <div className="group relative flex-1">
              <div
                className={cn(
                  {
                    "bg-zinc-100 text-right dark:bg-zinc-900": chat.isHuman,
                    "bg-gray-200 hover:bg-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-900":
                      !chat.isHuman,
                  },
                  "cursor-pointer whitespace-pre-line rounded-xl p-3",
                )}
              >
                {chat.text}
              </div>

              {!chat.isHuman && (
                <div className="absolute bottom-[-34px] opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
                  <div className="flex items-center space-x-2 rounded">
                    <Button
                      onClick={() => handleCopy(chat.text)}
                      className="flex items-center space-x-1 focus:outline-none"
                      variant="ghost"
                      size="sm"
                    >
                      {copiedText === chat.text ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
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
