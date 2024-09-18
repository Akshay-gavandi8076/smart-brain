import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { DeleteDocumentButton } from "./[documentId]/delete-document-button";
import { TagsList } from "@/components/tags-list";
import { splitTags } from "@/lib/utils";

interface DocumentCardProps {
  document: Doc<"documents">;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { title, description, tags, _id } = document;

  return (
    <Card className="shadow-[0_10px_10px_rgba(8,_112,_184,_0.7)]">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {description ? (
            <div>
              {description.length > 90
                ? `${description.substring(0, 90)}...`
                : description}
            </div>
          ) : (
            <div className="flex justify-center">
              <Loader2
                className="animate-spin"
                aria-label="Loading document description"
              />
            </div>
          )}
          {tags && <TagsList tags={splitTags(tags)} />}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between md:gap-2">
        <Button variant="secondary" className="flex items-center gap-2" asChild>
          <Link href={`/dashboard/documents/${_id}`}>
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">View</span>
          </Link>
        </Button>
        <DeleteDocumentButton documentId={_id} />
      </CardFooter>
    </Card>
  );
}
