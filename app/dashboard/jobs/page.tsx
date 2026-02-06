"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

import { Skeleton } from "@/components/ui/skeleton";
import CreateJobButton from "./create-job-button";
import JobList from "./job-list";
import JobCard from "./job-card";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { btnIconStyles } from "@/styles/styles";

export type JobStatus =
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "archived";

const STATUSES: JobStatus[] = [
  "applied",
  "interview",
  "offer",
  "rejected",
  "archived",
];

function norm(s: string) {
  return s.trim().toLowerCase();
}

function uniqSorted(values: string[]) {
  const m = new Map<string, string>();
  for (const v of values) {
    const vv = v?.trim();
    if (!vv) continue;
    const key = norm(vv);
    if (!m.has(key)) m.set(key, vv);
  }
  return Array.from(m.values()).sort((a, b) => a.localeCompare(b));
}

export default function JobsPage() {
  const jobs = useQuery(api.jobs.getJobs);
  const updateStatus = useMutation(api.jobs.updateJobStatus);

  const [localJobs, setLocalJobs] = useState<Doc<"jobs">[] | null>(null);
  const [activeJobId, setActiveJobId] = useState<Id<"jobs"> | null>(null);

  // --------- Filters / Search ----------
  const [search, setSearch] = useState("");
  const [companyFilters, setCompanyFilters] = useState<string[]>([]);
  const [titleFilters, setTitleFilters] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const blurTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!jobs) return;
    setLocalJobs(jobs);
  }, [jobs]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  // Build suggestion sources from existing jobs (client-side, fast, no extra schema/index)
  const allCompanies = useMemo(() => {
    const source = localJobs ?? [];
    return uniqSorted(source.map((j) => j.company));
  }, [localJobs]);

  const allTitles = useMemo(() => {
    const source = localJobs ?? [];
    return uniqSorted(source.map((j) => j.title));
  }, [localJobs]);

  const filteredCompanySuggestions = useMemo(() => {
    const q = norm(search);
    if (!q) return [];
    return allCompanies
      .filter(
        (c) =>
          norm(c).includes(q) &&
          !companyFilters.some((f) => norm(f) === norm(c)),
      )
      .slice(0, 8);
  }, [search, allCompanies, companyFilters]);

  const filteredTitleSuggestions = useMemo(() => {
    const q = norm(search);
    if (!q) return [];
    return allTitles
      .filter(
        (t) =>
          norm(t).includes(q) && !titleFilters.some((f) => norm(f) === norm(t)),
      )
      .slice(0, 8);
  }, [search, allTitles, titleFilters]);

  const addCompanyFilter = (name: string) => {
    const v = name.trim();
    if (!v) return;
    setCompanyFilters((prev) =>
      prev.some((p) => norm(p) === norm(v)) ? prev : [...prev, v],
    );
    setSearch("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const addTitleFilter = (name: string) => {
    const v = name.trim();
    if (!v) return;
    setTitleFilters((prev) =>
      prev.some((p) => norm(p) === norm(v)) ? prev : [...prev, v],
    );
    setSearch("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeCompanyFilter = (name: string) => {
    setCompanyFilters((prev) => prev.filter((p) => norm(p) !== norm(name)));
  };

  const removeTitleFilter = (name: string) => {
    setTitleFilters((prev) => prev.filter((p) => norm(p) !== norm(name)));
  };

  const clearAllFilters = () => {
    setCompanyFilters([]);
    setTitleFilters([]);
    setSearch("");
    setShowSuggestions(false);
  };

  // Apply filters + free-text search BEFORE grouping (keeps JobList untouched)
  const filteredJobs = useMemo(() => {
    const source = localJobs ?? [];

    let out = source;

    if (companyFilters.length > 0) {
      const set = new Set(companyFilters.map((c) => norm(c)));
      out = out.filter((j) => set.has(norm(j.company)));
    }

    if (titleFilters.length > 0) {
      const set = new Set(titleFilters.map((t) => norm(t)));
      out = out.filter((j) => set.has(norm(j.title)));
    }

    const q = norm(search);
    if (q) {
      out = out.filter((j) => {
        const hay = [
          j.company,
          j.title,
          j.location ?? "",
          j.notes ?? "",
          j.link ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    return out;
  }, [localJobs, companyFilters, titleFilters, search]);

  const grouped = useMemo(() => {
    const empty: Record<JobStatus, Doc<"jobs">[]> = {
      applied: [],
      interview: [],
      offer: [],
      rejected: [],
      archived: [],
    };

    for (const job of filteredJobs) empty[job.status].push(job);
    return empty;
  }, [filteredJobs]);

  const activeJob = useMemo(() => {
    if (!activeJobId) return null;
    return (localJobs ?? []).find((j) => j._id === activeJobId) ?? null;
  }, [activeJobId, localJobs]);

  // DnD handlers (keep your existing behavior)
  const onDragStart = (event: DragStartEvent) => {
    setActiveJobId(event.active.id as Id<"jobs">);
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveJobId(null);

    const overId = event.over?.id;
    if (!overId || typeof overId !== "string") return;

    const toStatus = overId as JobStatus;
    if (!STATUSES.includes(toStatus)) return;

    const jobId = event.active.id as Id<"jobs">;
    const fromStatus = event.active.data.current?.status as
      | JobStatus
      | undefined;

    if (fromStatus === toStatus) return;

    // Optimistic: move instantly, newest first (put on top of array)
    setLocalJobs((prev) => {
      if (!prev) return prev;
      const idx = prev.findIndex((j) => j._id === jobId);
      if (idx === -1) return prev;

      const updated: Doc<"jobs"> = { ...prev[idx], status: toStatus };
      const next = prev.filter((j) => j._id !== jobId);

      return [updated, ...next];
    });

    try {
      await updateStatus({ jobId, status: toStatus });
    } catch (e) {
      setLocalJobs(jobs ?? null);
      console.error(e);
    }
  };

  // Loading state
  if (!jobs || !localJobs) {
    return (
      <main className="flex h-full w-full flex-col">
        <header className="sticky top-0 z-30 border-b bg-background">
          <div className="flex h-16 items-center justify-between gap-3 px-2 sm:px-0">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-[360px]" />
            <Skeleton className="h-10 w-40" />
          </div>
        </header>

        <div className="flex-1 overflow-auto px-2 pb-6 pt-4 sm:px-0">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[520px] rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const hasAnyFilter =
    companyFilters.length > 0 ||
    titleFilters.length > 0 ||
    search.trim() !== "";

  return (
    <main className="flex h-full w-full flex-col">
      {/* Sticky page header */}
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="flex h-16 items-center justify-between gap-3 px-2 sm:px-0">
          <h1 className="text-2xl font-bold sm:text-4xl">Jobs</h1>

          {/* Search + suggestions (between title and create button) */}
          <div className="relative w-full max-w-[520px]">
            <Input
              ref={(el) => {
                inputRef.current = el;
              }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (blurTimerRef.current)
                  window.clearTimeout(blurTimerRef.current);
                setShowSuggestions(true);
              }}
              onBlur={() => {
                // allow clicking suggestions without the dropdown disappearing
                blurTimerRef.current = window.setTimeout(() => {
                  setShowSuggestions(false);
                }, 120);
              }}
              placeholder="Search jobs or add filters (company/title)…"
              className="w-full"
            />

            {showSuggestions &&
              search.trim() &&
              (filteredCompanySuggestions.length > 0 ||
                filteredTitleSuggestions.length > 0) && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border bg-background shadow-lg">
                  <div className="max-h-[320px] overflow-auto p-2">
                    {filteredCompanySuggestions.length > 0 && (
                      <div className="mb-2">
                        <div className="px-2 pb-1 text-xs font-semibold text-muted-foreground">
                          Companies
                        </div>
                        <div className="space-y-1">
                          {filteredCompanySuggestions.map((c) => (
                            <button
                              key={`c-${c}`}
                              type="button"
                              onMouseDown={(e) => {
                                // prevent blur before click
                                e.preventDefault();
                                addCompanyFilter(c);
                              }}
                              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-accent"
                            >
                              <span className="truncate">{c}</span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                Add as company
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredTitleSuggestions.length > 0 && (
                      <div>
                        <div className="px-2 pb-1 text-xs font-semibold text-muted-foreground">
                          Roles
                        </div>
                        <div className="space-y-1">
                          {filteredTitleSuggestions.map((t) => (
                            <button
                              key={`t-${t}`}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                addTitleFilter(t);
                              }}
                              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm hover:bg-accent"
                            >
                              <span className="truncate">{t}</span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                Add as role
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>

          <CreateJobButton />
        </div>

        {/* Filter chips row */}
        {(companyFilters.length > 0 || titleFilters.length > 0) && (
          <div className="border-t bg-background px-2 py-2 sm:px-0">
            <div className="flex flex-wrap items-center gap-2">
              {companyFilters.map((c) => (
                <span
                  key={`cf-${c}`}
                  className={cn(
                    badgeVariants({ variant: "secondary" }),
                    "flex items-center gap-1",
                  )}
                >
                  <span className="text-xs font-semibold text-muted-foreground">
                    Company:
                  </span>
                  <span className="text-xs">{c}</span>
                  <button
                    type="button"
                    onClick={() => removeCompanyFilter(c)}
                    className="ml-1 rounded-sm p-0.5 hover:bg-accent"
                    aria-label={`Remove company filter ${c}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              {titleFilters.map((t) => (
                <span
                  key={`tf-${t}`}
                  className={cn(
                    badgeVariants({ variant: "secondary" }),
                    "flex items-center gap-1",
                  )}
                >
                  <span className="text-xs font-semibold text-muted-foreground">
                    Role:
                  </span>
                  <span className="text-xs">{t}</span>
                  <button
                    type="button"
                    onClick={() => removeTitleFilter(t)}
                    className="ml-1 rounded-sm p-0.5 hover:bg-accent"
                    aria-label={`Remove title filter ${t}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}

              <div className="flex-1" />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 p-4"
              >
                <XIcon className={btnIconStyles} />
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* One global scroll container */}
      <div className="flex-1 overflow-auto px-2 pb-6 pt-4 sm:px-0">
        {/* Optional: small info row */}
        {hasAnyFilter && (
          <div className="mb-3 text-xs text-muted-foreground">
            Showing <span className="font-semibold">{filteredJobs.length}</span>{" "}
            job(s) matching your filters/search.
          </div>
        )}

        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <JobList grouped={grouped} stickyOffsetPx={10} />

          <DragOverlay dropAnimation={{ duration: 140, easing: "ease-out" }}>
            {activeJob ? (
              <div className="w-full max-w-[360px]">
                <JobCard job={activeJob} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}
