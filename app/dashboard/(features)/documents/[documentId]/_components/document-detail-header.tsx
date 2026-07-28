"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { TagsList } from "@/components/shared/tags-list";
import { parseTags } from "@/lib/tags";
import { DeleteDocumentButton } from "./delete-document-button";
import { btnIconStyles } from "@/styles/styles";

type DocumentWithUrl = Doc<"documents"> & {
  documentUrl: string | null;
};

interface DocumentDetailHeaderProps {
  document: DocumentWithUrl;
}

export default function DocumentDetailHeader({
  document,
}: DocumentDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className={btnIconStyles} />
        </Button>

        <h1 className="text-4xl font-bold">{document.title}</h1>
      </div>

      <TagsList tags={parseTags(document.tags)} />

      <DeleteDocumentButton
        documentId={document._id}
        documentTitle={document.title}
      />
    </div>
  );
}
