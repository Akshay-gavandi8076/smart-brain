export function formatJobDate(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function getJobUpdatedAt(job: {
  updatedAt?: number;
  movedAt: number;
  createdAt: number;
}): number {
  return job.updatedAt ?? job.movedAt ?? job.createdAt;
}
