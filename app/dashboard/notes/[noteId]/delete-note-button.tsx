import { DeleteButton } from "@/components/DeleteButton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

interface DeleteNoteButtonProps {
  noteId: Id<"notes">;
  onSuccessRedirect?: string;

  iconOnly?: boolean;
}

export function DeleteNoteButton({
  noteId,
  onSuccessRedirect,
  iconOnly = false,
}: DeleteNoteButtonProps) {
  const deleteNote = useMutation(api.notes.deleteNote);

  return (
    <DeleteButton<Id<"notes">>
      id={noteId}
      entityType="note"
      onSuccessRedirect={onSuccessRedirect}
      onDelete={async ({ id }) => {
        await deleteNote({ noteId: id });
      }}
      confirmationMessage="Are you sure you want to delete this note?"
      iconOnly={iconOnly}
    />
  );
}
