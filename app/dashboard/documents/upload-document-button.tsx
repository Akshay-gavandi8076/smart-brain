"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadDocumentForm from "./upload-document-form";
import { useState } from "react";
import { Upload } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/styles";
import { useToast } from "@/components/ui/use-toast";

export default function UploadeDocumentButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const handleUploadDocument = () => {
    setIsOpen(false);
    toast({
      title: "Document uploaded",
      description: "Your document has been uploaded successfully.",
    });
  };
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className={btnStyles}>
          <Upload className={btnIconStyles} />
          <span className="hidden sm:inline">Upload Document</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a document</DialogTitle>
          <DialogDescription>
            Upload a team document for you to search over in the future.
          </DialogDescription>
          <UploadDocumentForm onDocumentUpload={handleUploadDocument} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
