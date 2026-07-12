"use client";

import Skeleton from "./Skeleton";

interface Props {
  rows?: number;
}

export default function FormSkeleton({
  rows = 4,
}: Props) {
  return (
    <div className="space-y-6">

      {/* Judul */}

      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Input */}

      <div className="space-y-5">
        {Array.from({ length: rows }).map(
          (_, index) => (
            <div
              key={index}
              className="space-y-2"
            >
              <Skeleton className="h-4 w-24" />

              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          )
        )}
      </div>

      {/* Tombol */}

      <div className="flex justify-end gap-3 pt-2">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
}