"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { QuestionForm } from "./question-form";
import { useUser } from "@clerk/nextjs";
import { ChatMessage } from "./ChatMessage";

interface ChatPanelProps {
  documentId: Id<"documents">;
}

export default function ChatPanel({ documentId }: ChatPanelProps) {
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
      setTimeout(() => setCopiedText(null), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl p-2 dark:bg-zinc-800">
      <div
        ref={chatContainerRef}
        className="h-[670px] space-y-2 overflow-y-auto"
      >
        {chats?.map((chat) => (
          <ChatMessage
            key={chat._id}
            chat={chat}
            user={user || { imageUrl: null }}
            onCopy={handleCopy}
            copiedText={copiedText}
          />
        ))}
      </div>
      <QuestionForm documentId={documentId} />
    </div>
  );
}
