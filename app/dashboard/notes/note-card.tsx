import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { DeleteNoteButton } from "./[noteId]/delete-note-button";

export function NoteCard({ note }: { note: Doc<"notes"> }) {
  return (
    <Card className="shadow-[0_10px_10px_rgba(8,_112,_184,_0.7)]">
      <CardHeader>{/* <CardTitle>{}</CardTitle> */}</CardHeader>
      <CardContent>
        <div>
          {!note ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>{note.text.substring(0, 90) + "..."}</>
          )}
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
