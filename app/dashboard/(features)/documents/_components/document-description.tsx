"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const PENDING_TIMEOUT_MS = 45_000;
const UNAVAILABLE_PATTERNS = [
  "unavailable",
  "could not",
  "could not be read",
];

interface DocumentDescriptionProps {
  description?: string;
  title: string;
}

function isUnavailableDescription(description: string): boolean {
  const lower = description.toLowerCase();
  return UNAVAILABLE_PATTERNS.some((p) => lower.includes(p));
}

export function DocumentDescription({
  description,
  title,
}: DocumentDescriptionProps) {
  const [timedOut, setTimedOut] = useState(false);
  const isPending = description === undefined || description === "";

  useEffect(() => {
    if (!isPending) {
      setTimedOut(false);
      return;
    }

    const timer = setTimeout(() => setTimedOut(true), PENDING_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isPending, description]);

  if (isPending && !timedOut) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
        <span>Generating AI summary…</span>
      </div>
    );
  }

  if (isPending && timedOut) {
    return (
      <div className="flex items-start gap-2 rounded-md bg-amber-500/10 p-2 text-sm text-amber-900 dark:text-amber-200">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Summary is taking longer than expected. You can still open and read{" "}
          <span className="font-medium">{title}</span>.
        </span>
      </div>
    );
  }

  if (description && isUnavailableDescription(description)) {
    return (
      <div className="flex items-start gap-2 rounded-md bg-muted p-2 text-sm text-muted-foreground">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 opacity-60" />
        <span>{description}</span>
      </div>
    );
  }

  const text = description ?? "";
  const preview = text.length > 90 ? `${text.substring(0, 90)}…` : text;

  return (
    <p className={cn("text-sm leading-relaxed text-muted-foreground")}>
      {preview}
    </p>
  );
}
