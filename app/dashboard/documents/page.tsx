"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DocumentCard } from "./document-card";
import UploadeDocumentButton from "./upload-document-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  const documents = useQuery(api.documents.getDocuments);

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-4xl md:text-4xl lg:text-4xl">
          My Documents
        </h1>
        <UploadeDocumentButton />
      </div>

      {!documents && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {new Array(4).fill(0).map((_, i) => (
            <Card
              key={i}
              className="flex h-[150px] flex-col justify-between p-6"
            >
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[30px] w-[80px] rounded" />
            </Card>
          ))}
        </div>
      )}

      {documents && documents.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-6 py-12">
          <Image
            src="/documents.svg"
            width="200"
            height="200"
            alt="No documents"
          />
          <h2 className="text-2xl">You have no documents</h2>
          <UploadeDocumentButton />
        </div>
      )}

      {documents && documents.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {documents?.map((doc) => (
            <DocumentCard key={doc._id} document={doc} />
          ))}
        </div>
      )}
    </main>
  );
}
