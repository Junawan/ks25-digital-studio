"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { collection, onSnapshot, orderBy, query, where, type DocumentData, type QuerySnapshot } from "firebase/firestore";
import { db } from "@/core/firebase";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { notificationService } from "./notification.service";
import type { Notification } from "./notification.types";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [], unreadCount: 0, loading: true, markAsRead: async () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { workspace } = useWorkspace();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = workspace?.user.userId;

  useEffect(() => {
    if (!workspace) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const lists = new Map<string, Notification[]>();
    const publish = () => {
      setNotifications([...lists.values()].flat().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      setLoading(false);
    };
    const toNotifications = (snapshot: QuerySnapshot<DocumentData>) => snapshot.docs.map((entry) => {
      const data = entry.data();
      const createdAt = data.createdAt && typeof data.createdAt.toDate === "function" ? data.createdAt.toDate() : new Date();
      const isCompanyBroadcast = data.receiverType === "company";
      return { ...data, notificationId: String(data.notificationId || entry.id), createdAt, isRead: isCompanyBroadcast ? (Array.isArray(data.readBy) && data.readBy.includes(userId)) : data.isRead === true } as Notification;
    });

    if (workspace.user.isSystemAdmin) {
      return onSnapshot(query(collection(db, "notifications"), where("receiverType", "==", "system-admin"), orderBy("createdAt", "desc")), (snapshot) => {
        lists.set("system", toNotifications(snapshot));
        publish();
      }, () => setLoading(false));
    }

    const companyQuery = query(collection(db, "notifications"), where("companyId", "==", workspace.company.id));
    return onSnapshot(companyQuery, (snapshot) => {
      lists.set("company", toNotifications(snapshot).filter((entry) => entry.receiverType === "company" || (entry.receiverType === "user" && entry.receiverId === userId)));
      publish();
    }, () => setLoading(false));
  }, [workspace]);

  const markAsRead = async (notificationId: string) => notificationService.markAsRead(notificationId, userId);
  const unreadCount = notifications.filter((notification) => notification.receiverType === "company"
    ? !notification.readBy?.includes(userId || "")
    : !notification.isRead).length;
  const value = useMemo(() => ({ notifications, unreadCount, loading, markAsRead }), [notifications, unreadCount, loading]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotification() {
  return useContext(NotificationContext);
}
