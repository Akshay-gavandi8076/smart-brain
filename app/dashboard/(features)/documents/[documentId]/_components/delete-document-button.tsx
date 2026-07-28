import { DeleteButton } from "@/components/shared/delete-button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

interface DeleteDocumentButtonProps {
  documentId: Id<"documents">;
  documentTitle?: string;
}

export function DeleteDocumentButton({
  documentId,
  documentTitle,
}: DeleteDocumentButtonProps) {
  const deleteDocument = useMutation(api.documents.deleteDocument);

  return (
    <DeleteButton
      id={documentId}
      entityType="document"
      entityName={documentTitle}
      onSuccessRedirect="/dashboard/documents"
      onDelete={async ({ id }) => {
        await deleteDocument({ documentId: id });
      }}
    />
  );
}
