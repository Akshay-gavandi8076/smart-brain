import { LoadingButton } from "@/components/loading-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { btnIconStyles, btnStyles } from "@/styles/styles";
import { TrashIcon } from "lucide-react";

type DeleteButtonProps<T> = {
  id: T;
  entityType: "document" | "note";
  onSuccessRedirect: string;
  onDelete: (args: { id: T }) => Promise<void>; // Expect an object with an id property of type T
  confirmationMessage: string;
};

export function DeleteButton<T>({
  id,
  entityType,
  onSuccessRedirect,
  onDelete,
  confirmationMessage,
}: DeleteButtonProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete({ id }); // Pass an object with the id property
      router.push(onSuccessRedirect);
    } catch (error) {
      console.error(`Failed to delete ${entityType}:`, error);
      // Optionally handle errors and show a user-friendly message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <AlertDialogTrigger>
        <Button variant="destructive" className={btnStyles}>
          <TrashIcon className={btnIconStyles} />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmationMessage}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            onClick={handleDelete}
            isLoading={isLoading}
            loadingText="Deleting..."
          >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
