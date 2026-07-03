"use client";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import type { Notification } from "../notification.types";

import { notificationService } from "../notification.service";

export function useNotifications() {

  const { workspace } =
    useWorkspace();

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {

  if (!workspace) {

    setNotifications([]);

    setLoading(false);

    return;

  }

  let q;

  if (workspace.user.isSystemAdmin) {

    q = query(

      collection(
        db,
        "notifications"
      ),

      where(
        "receiverType",
        "==",
        "system-admin"
      ),

      orderBy(
        "createdAt",
        "desc"
      )

    );

  } else {

    q = query(

      collection(
        db,
        "notifications"
      ),

      where(
        "companyId",
        "==",
        workspace.company.id
      ),

      where(
        "receiverType",
        "==",
        "user"
      ),

      where(
        "receiverId",
        "==",
        workspace.user.userId
      ),

      orderBy(
        "createdAt",
        "desc"
      )

    );

  }

  const unsubscribe =
    onSnapshot(

      q,

      (snapshot) => {

        setNotifications(

          snapshot.docs.map(

            (doc) =>

              doc.data() as Notification

          )

        );

        setLoading(false);

      }

    );

  return () =>

    unsubscribe();

}, [workspace]);

  return {

    notifications,

    loading,

    refresh: async () => {},

  };

}