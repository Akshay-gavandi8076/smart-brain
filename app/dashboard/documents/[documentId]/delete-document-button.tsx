import { DeleteButton } from "@/components/DeleteButton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

export function DeleteDocumentButton({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const deleteDocument = useMutation(api.documents.deleteDocument);

  return (
    <DeleteButton
      id={documentId}
      entityType="document"
      onSuccessRedirect="/dashboard/documents"
      onDelete={async ({ id }) => {
        await deleteDocument({ documentId: id });
      }}
      confirmationMessage="Are you sure you want to delete this document?"
    />
  );
}
