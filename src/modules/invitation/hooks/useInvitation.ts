"use client";

import {
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/modules/invitation/providers/AuthProvider";
import type { DemoInvitation } from "@/modules/invitation/data/demoInvitations";

export default function useInvitation(
  slug: string,
  enabled = true,
) {
  const { user, loading: authLoading } = useAuth();

  const [data, setData] =
    useState<DemoInvitation | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const preview = new URLSearchParams(window.location.search).get("preview") === "1";
    if (preview && authLoading) return;
    const load = async () => {
      const token = preview ? await user?.getIdToken() : undefined;
      const response = await fetch(`/api/undangan/${slug}${preview ? "?preview=1" : ""}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
      return response.ok ? await response.json() as DemoInvitation : null;
    };
    load()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));

  }, [slug, user, authLoading, enabled]);

  return {
    data,
    loading,
  };
}
