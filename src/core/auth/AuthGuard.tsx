"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/core/providers/AuthProvider";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}