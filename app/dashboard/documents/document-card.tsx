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

export function DocumentCard({ document }: { document: Doc<"documents"> }) {
  return (
    <Card className="shadow-[0_10px_10px_rgba(8,_112,_184,_0.7)]">
      <CardHeader>
        <CardTitle>{document.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {!document.description ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            document.description
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="secondary" className="flex items-center gap-2" asChild>
          <Link href={`/dashboard/documents/${document._id}`}>
            <Eye className="h-4 w-4" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
