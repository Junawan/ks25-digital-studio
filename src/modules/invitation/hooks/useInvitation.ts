"use client";

import {
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/modules/invitation/providers/AuthProvider";

export default function useInvitation(
  slug: string
) {
  const { user, loading: authLoading } = useAuth();

  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("preview") === "1";
    if (preview && authLoading) return;
    const load = async () => {
      const token = preview ? await user?.getIdToken() : undefined;
      return fetch(`/api/undangan/${slug}${preview ? "?preview=1" : ""}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
    };
    load()
      .then(async (res) => res.ok ? res.json() : null)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));

  }, [slug, user, authLoading]);

  return {
    data,
    loading,
  };
}
