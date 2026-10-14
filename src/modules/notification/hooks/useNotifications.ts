"use client";

import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/core/firebase";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import type { Notification } from "../notification.types";

export function useNotifications() {
  const { workspace } = useWorkspace();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspace) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const userId = workspace.user.userId;
    const notificationQuery = workspace.user.isSystemAdmin
      ? query(collection(db, "notifications"), where("receiverType", "==", "system-admin"), orderBy("createdAt", "desc"))
      : query(collection(db, "notifications"), where("companyId", "==", workspace.company.id));
    return onSnapshot(notificationQuery, (snapshot) => {
      const rows = snapshot.docs.map((entry) => {
        const data = entry.data();
        const isBroadcast = data.receiverType === "company";
        const createdAt = data.createdAt && typeof data.createdAt.toDate === "function" ? data.createdAt.toDate() : new Date();
        return {
          ...data,
          notificationId: String(data.notificationId || entry.id),
          createdAt,
          isRead: isBroadcast ? (Array.isArray(data.readBy) && data.readBy.includes(userId)) : data.isRead === true,
        } as Notification;
      }).filter((entry) => workspace.user.isSystemAdmin || entry.receiverType === "company" || (entry.receiverType === "user" && entry.receiverId === userId))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setNotifications(rows);
      setLoading(false);
    }, () => setLoading(false));
  }, [workspace]);

  return { notifications, loading, refresh: async () => {} };
}
