"use client";

import {

  useCallback,

  useEffect,

  useState,

} from "react";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import { notificationService } from "../notification.service";

export function useUnreadNotificationCount() {

  const { workspace } =

    useWorkspace();

  const [

    count,

    setCount,

  ] = useState(0);

  const [

    loading,

    setLoading,

  ] = useState(true);

  const load =
  useCallback(async () => {

    if (!workspace) {

      setLoading(false);

      return;

    }

    const unread =
  await notificationService.getUnreadCount(

    workspace.user.isSystemAdmin,

    workspace.company.id,

    workspace.user.userId

  );

    setCount(unread);

    setLoading(false);

  }, [workspace]);

  useEffect(() => {

    load();

  }, [load]);

  return {

    count,

    loading,

    refresh: load,

  };

}