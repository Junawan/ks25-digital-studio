"use client";

import Skeleton from "./Skeleton";

interface Props {
  rows?: number;
}

export default function TableSkeleton({
  rows = 8,
}: Props) {
  return (
    <div className="space-y-4">

      {/* Toolbar */}

      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-72" />

        <Skeleton className="h-10 w-32" />
      </div>

      {/* Header */}

      <Skeleton className="h-12 w-full rounded-xl" />

      {/* Rows */}

      <div className="space-y-3">
        {Array.from({
          length: rows,
        }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-16 w-full rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}