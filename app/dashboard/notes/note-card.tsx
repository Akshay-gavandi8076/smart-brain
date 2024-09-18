import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { DeleteNoteButton } from "./[noteId]/delete-note-button";
import { TagsList } from "@/components/tags-list";
import { splitTags } from "@/lib/utils";

interface NoteCardProps {
  note: Doc<"notes">;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className="shadow-[0_10px_10px_rgba(8,_112,_184,_0.7)]">
      <CardHeader>
        <CardTitle className="text-2xl">{note.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {!note ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" aria-label="Loading note" />{" "}
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
