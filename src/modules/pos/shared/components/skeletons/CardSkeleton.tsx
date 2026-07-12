"use client";

import Skeleton from "./Skeleton";

interface Props {
  count?: number;
}

export default function CardSkeleton({
  count = 6,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({
        length: count,
      }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border p-5"
        >
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />

            <Skeleton className="h-5 w-3/4" />

            <Skeleton className="h-4 w-full" />

            <Skeleton className="h-4 w-2/3" />

            <div className="flex justify-between pt-3">
              <Skeleton className="h-8 w-20" />

              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}