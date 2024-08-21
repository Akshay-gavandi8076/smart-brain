import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MouseEvent, ReactNode } from "react";

export function LoadingButton({
  isLoading,
  children,
  loadingText,
  size,
  onClick,
}: {
  isLoading: boolean;
  children: ReactNode;
  loadingText?: string;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
}) {
  return (
    <Button
      className="flex items-center gap-1"
      disabled={isLoading}
      type="submit"
      onClick={(e) => {
        onClick?.(e);
      }}
      size={size}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {isLoading ? loadingText : children}
    </Button>
  );
}
