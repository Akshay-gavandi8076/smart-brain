"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { DocumentCard } from "./document-card";
import UploadeDocumentButton from "./upload-document-button";
import Image from "next/image";
import { CardSkeleton } from "@/components/CardSkeleton";

export default function Home() {
  const documents = useQuery(api.documents.getDocuments);

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-4xl">My Documents</h1>
        <UploadeDocumentButton />
      </div>

      {!documents ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : documents.length === 0 ? (
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
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {documents.map((doc) => (
            <DocumentCard key={doc._id} document={doc} />
          ))}
        </div>
      )}
    </main>
  );
}
