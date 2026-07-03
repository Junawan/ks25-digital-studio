"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  Announcement,
} from "../announcement.types";

import {
  getAnnouncementsUseCase,
} from "../usecases/GetAnnouncementsUseCase";

export function useAnnouncements() {

  const [
    announcements,
    setAnnouncements,
  ] = useState<Announcement[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const load =
    useCallback(async () => {

      try {

        setLoading(true);

        const data =
          await getAnnouncementsUseCase.execute();

        setAnnouncements(data);

      } finally {

        setLoading(false);

      }

    }, []);

  useEffect(() => {

    load();

  }, [load]);

  return {

    announcements,

    loading,

    refresh: load,

  };

}