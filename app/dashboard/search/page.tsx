"use client";

import { useEffect, useState } from "react";
import { SearchForm } from "./search-form";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { FileIcon, NotebookPen } from "lucide-react";

function SearchResults({
  url,
  type,
  score,
  text,
}: {
  url: string;
  type: string;
  score: number;
  text: string;
}) {
  return (
    <Link href={url}>
      <li className="cursor-pointer space-y-8 whitespace-pre-line rounded bg-zinc-100 p-4 text-black dark:bg-zinc-800 dark:text-white">
        <div className="flex items-center justify-between text-2xl">
          <div className="flex items-center gap-2">
            {type === "note" ? (
              <NotebookPen className="h-5 w-5" />
            ) : (
              <FileIcon className="h-5 w-5" />
            )}
            {type === "note" ? "Note" : "Document"}
          </div>
          <div className="rounded-xl bg-zinc-200 p-2 text-sm text-black dark:bg-zinc-700 dark:text-white">
            <span className="hidden sm:inline">Relevancy of</span> {""}
            {score.toFixed(2)}
          </div>
        </div>
        {text.substring(0, 300) + "..."}
      </li>
    </Link>
  );
}

export default function SearchPage() {
  const [results, setResults] =
    useState<typeof api.search.searchAction._returnType>(null);

  useEffect(() => {
    const searchResults = localStorage.getItem("searchResults");

    if (!searchResults) return;

    setResults(JSON.parse(searchResults));
  }, []);

  return (
    <main className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-4xl md:text-4xl lg:text-4xl">
          Search
        </h1>
      </div>

      <SearchForm
        setResults={(searchResult) => {
          setResults(searchResult);
          localStorage.setItem("searchResults", JSON.stringify(searchResult));
        }}
      />

      <ul className="flex flex-col gap-4">
        {results?.map((result) => {
          if (result.type === "notes") {
            return (
              // eslint-disable-next-line react/jsx-key
              <SearchResults
                type="note"
                url={`/dashboard/notes/${result.record._id}`}
                score={result.score}
                text={result.record.text}
              />
            );
          } else {
            return (
              // eslint-disable-next-line react/jsx-key
              <SearchResults
                type="document"
                url={`/dashboard/documents/${result.record._id}`}
                score={result.score}
                text={result.record.title + " " + result.record.description}
              />
            );
          }
        })}
      </ul>
    </main>
  );
}
