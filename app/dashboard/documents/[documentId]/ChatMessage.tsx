import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bot, Check, Copy } from "lucide-react";
import Image from "next/image";

interface ChatMessageProps {
  chat: {
    text: string;
    isHuman: boolean;
  };
  user: { imageUrl?: string | null };
  onCopy: (text: string) => void;
  copiedText: string | null;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  chat,
  user,
  onCopy,
  copiedText,
}) => (
  <div
    className={cn("relative flex items-start gap-3 rounded p-4", {
      "flex-row-reverse justify-end": chat.isHuman,
      "bg-transparent": !chat.isHuman,
    })}
  >
    {chat.isHuman ? (
      <Image
        src={user.imageUrl!}
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
        className={cn("cursor-pointer whitespace-pre-line rounded-xl p-3", {
          "bg-zinc-100 text-right dark:bg-zinc-900": chat.isHuman,
          "bg-gray-200 hover:bg-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-900":
            !chat.isHuman,
        })}
      >
        {chat.text}
      </div>

      {!chat.isHuman && (
        <div className="absolute bottom-[-34px] opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
          <Button
            onClick={() => onCopy(chat.text)}
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
      )}
    </div>
  </div>
);
