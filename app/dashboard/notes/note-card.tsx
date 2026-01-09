// app/dashboard/notes/note-card.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Eye, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { DeleteNoteButton } from "./[noteId]/delete-note-button";
import { TagsList } from "@/components/tags-list";
import { splitTags } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NoteCardProps {
  note: Doc<"notes">;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className="shadow-[0_10px_10px_rgba(8,_112,_184,_0.7)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          {/* Document indicator */}
          {note.documentId && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex cursor-default">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent>Created from a document</TooltipContent>
            </Tooltip>
          )}

          {note.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          {!note ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" aria-label="Loading note" />
            </div>
          ) : (
            <div>
              {note.text.length > 90
                ? `${note.text.substring(0, 90)}...`
                : note.text}
            </div>
          )}

          {note.tags && <TagsList tags={splitTags(note.tags || "")} />}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between md:gap-2">
        <Button variant="secondary" className="flex items-center gap-2" asChild>
          <Link href={`/dashboard/notes/${note._id}`}>
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">View</span>
          </Link>
        </Button>

        <DeleteNoteButton noteId={note._id} />
      </CardFooter>
    </Card>
  );
}
