"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";

interface Props {
  rows?: number;
}

export default function LoadingSkeleton({
  rows = 6,
}: Props) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full rounded-lg" />

      <Skeleton className="h-12 w-full rounded-lg" />

      <div className="space-y-3">
        {Array.from({ length: rows }).map(
          (_, index) => (
            <Skeleton
              key={index}
              className="h-16 w-full rounded-lg"
            />
          )
        )}
      </div>
    </div>
  );
}