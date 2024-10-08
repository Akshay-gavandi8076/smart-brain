"use client";

import { useEffect, useState } from "react";
import { SearchForm } from "./search-form";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { FileIcon, NotebookPen, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { btnIconStyles, btnStyles } from "@/styles/styles";

interface SearchResultProps {
  url: string;
  type: "note" | "document";
  score: number;
  text: string;
}

const SearchResult: React.FC<SearchResultProps> = ({
  url,
  type,
  score,
  text,
}) => {
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
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </div>
          <div className="rounded-xl bg-zinc-200 p-2 text-sm text-black dark:bg-zinc-700 dark:text-white">
            <span className="hidden sm:inline">Relevancy of</span>{" "}
            {score.toFixed(2)}
          </div>
        </div>
        <p>{text.substring(0, 300)}...</p>
      </li>
    </Link>
  );
};

export default function SearchPage() {
  const [results, setResults] = useState<
    typeof api.search.searchAction._returnType | null
  >(null);

  useEffect(() => {
    const searchResults = localStorage.getItem("searchResults");
    if (searchResults) {
      setResults(JSON.parse(searchResults));
    }
  }, []);

  const handleSearchResultsUpdate = (
    searchResult: typeof api.search.searchAction._returnType,
  ) => {
    setResults(searchResult);
    localStorage.setItem("searchResults", JSON.stringify(searchResult));
  };

  const handleClearResults = () => {
    setResults(null);
    localStorage.removeItem("searchResults");
  };

  return (
    <main className="w-full space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-4xl">Search</h1>
        {results && (
          <Button
            variant="destructive"
            onClick={handleClearResults}
            className={btnStyles}
          >
            <Paintbrush className={btnIconStyles} />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </header>

      <SearchForm setResults={handleSearchResultsUpdate} />

      <ul className="flex flex-col gap-4">
        {results?.map((result, index) => {
          const { type, record } = result;
          const url =
            type === "notes"
              ? `/dashboard/notes/${record._id}`
              : `/dashboard/documents/${record._id}`;
          const displayText =
            type === "notes"
              ? record.text
              : `${record.title} ${record.description}`;

          return (
            <SearchResult
              key={record._id}
              type={type === "notes" ? "note" : "document"}
              url={url}
              score={result.score}
              text={displayText}
            />
          );
        })}
      </ul>
    </main>
  );
}
