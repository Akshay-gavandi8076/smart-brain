"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { QuestionForm } from "./question-form";
import { useUser } from "@clerk/nextjs";
import { ChatMessage } from "./ChatMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, MessageSquare } from "lucide-react";

interface ChatPanelProps {
  documentId: Id<"documents">;
  height: number;
}

function ChatLoadingSkeleton() {
  return (
    <div className="space-y-4 p-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={`flex gap-3 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}
        >
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <Skeleton className="h-16 flex-1 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

function ChatEmptyState() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 px-4 py-8 text-center text-muted-foreground">
      <MessageSquare className="h-10 w-10 opacity-40" />
      <p className="text-sm font-medium">No messages yet</p>
      <p className="text-xs">
        Ask a question about this document to start a conversation.
      </p>
    </div>
  );
}

function PendingReply() {
  return (
    <div className="flex items-start gap-3 rounded p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-900">
        <Bot className="h-7 w-7 text-blue-500" />
      </div>
      <div className="rounded-xl bg-gray-200 px-4 py-3 dark:bg-zinc-700">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export default function ChatPanel({ documentId, height }: ChatPanelProps) {
  const chats = useQuery(api.chats.getChatsForDocument, { documentId });
  const { user } = useUser();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isLoading = chats === undefined;
  const hasMessages = (chats?.length ?? 0) > 0 || pendingQuestion;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats, pendingQuestion]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    });
  };

  // Reserve space for tabs header (~52px) and input row (~52px)
  const panelHeight = Math.max(height - 52, 400);

  return (
    <div
      className="flex flex-col rounded-xl p-2 dark:bg-zinc-800"
      style={{ height: panelHeight }}
    >
      <div
        ref={chatContainerRef}
        className="flex-1 space-y-2 overflow-y-auto pb-2"
      >
        {isLoading ? (
          <ChatLoadingSkeleton />
        ) : !hasMessages ? (
          <ChatEmptyState />
        ) : (
          <>
            {chats?.map((chat) => (
              <ChatMessage
                key={chat._id}
                chat={chat}
                user={user ?? { imageUrl: null }}
                onCopy={handleCopy}
                copiedText={copiedText}
              />
            ))}
            {pendingQuestion && (
              <>
                <ChatMessage
                  chat={{ text: pendingQuestion, isHuman: true }}
                  user={user ?? { imageUrl: null }}
                  onCopy={handleCopy}
                  copiedText={copiedText}
                />
                <PendingReply />
              </>
            )}
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-zinc-300 pt-2 dark:border-zinc-600">
        <QuestionForm
          documentId={documentId}
          onPendingChange={setPendingQuestion}
        />
      </div>
    </div>
  );
}
