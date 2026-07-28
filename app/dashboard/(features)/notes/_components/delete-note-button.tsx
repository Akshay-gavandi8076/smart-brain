import { DeleteButton } from "@/components/shared/delete-button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

interface DeleteNoteButtonProps {
  noteId: Id<"notes">;
  noteTitle?: string;
  onSuccessRedirect?: string;

  iconOnly?: boolean;
}

export function DeleteNoteButton({
  noteId,
  noteTitle,
  onSuccessRedirect,
  iconOnly = false,
}: DeleteNoteButtonProps) {
  const deleteNote = useMutation(api.notes.deleteNote);

  return (
    <DeleteButton<Id<"notes">>
      id={noteId}
      entityType="note"
      entityName={noteTitle}
      onSuccessRedirect={onSuccessRedirect}
      onDelete={async ({ id }) => {
        await deleteNote({ noteId: id });
      }}
      iconOnly={iconOnly}
    />
  );
}
