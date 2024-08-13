import { DeleteButton } from "@/components/DeleteButton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

export function DeleteNoteButton({ noteId }: { noteId: Id<"notes"> }) {
  const deleteNote = useMutation(api.notes.deleteNote);

  return (
    <DeleteButton<Id<"notes">>
      id={noteId}
      entityType="note"
      onSuccessRedirect="/dashboard/notes"
      onDelete={async ({ id }) => {
        await deleteNote({ noteId: id });
      }}
      confirmationMessage="Are you sure you want to delete this note?"
    />
  );
}
