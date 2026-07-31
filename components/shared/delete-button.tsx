"use client";

import { LoadingButton } from "@/components/shared/loading-button";
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
import { AlertTriangle, TrashIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";

export type EntityType = "document" | "note" | "job";

type DeleteButtonProps<T> = {
  id: T;
  entityType: EntityType;
  entityName?: string;
  onSuccessRedirect?: string;
  onDelete: (args: { id: T }) => Promise<void>;
  iconOnly?: boolean;
  showLabel?: boolean;
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function DeleteButton<T>({
  id,
  entityType,
  entityName,
  onSuccessRedirect,
  onDelete,
  iconOnly = false,
  showLabel = false,
}: DeleteButtonProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await onDelete({ id });

      if (onSuccessRedirect) {
        router.push(onSuccessRedirect);
      }

      toast({
        title: `${entityName} ${entityType} deleted`,
        description: entityName
          ? `"${capitalize(entityName)}" has been deleted successfully.`
          : `The ${entityType} has been deleted successfully.`,
      });

      setIsOpen(false);
    } catch (error) {
      toast({
        title: `Failed to delete ${entityType}`,
        description: entityName
          ? `Unable to delete "${entityName}". Please try again.`
          : `Unable to delete the ${entityType}. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className={showLabel ? btnStyles : iconOnly ? "h-10 w-10" : btnStyles}
          size={iconOnly ? "icon" : "default"}
        >
          <TrashIcon className={btnIconStyles} />
          {!iconOnly && <span className="hidden sm:inline">Delete</span>}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {entityName
              ? `Delete "${entityName}" ${entityType}?`
              : `Delete this ${entityType}?`}
          </AlertDialogTitle>

          <AlertDialogDescription>
            You&apos;re about to permanently delete this{" "}
            <span className="font-medium text-foreground">
              {entityName
                ? `"${entityName}" ${entityType}`
                : `this ${entityType}`}
            </span>
            . Please confirm that you want to continue.
          </AlertDialogDescription>

          <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

            <div>
              <p className="font-medium text-destructive">Permanent action</p>

              <p className="mt-1 text-sm text-muted-foreground">
                This action cannot be undone. Once deleted, this {entityType}{" "}
                and all associated data will be permanently removed.
              </p>
            </div>
          </div>
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
