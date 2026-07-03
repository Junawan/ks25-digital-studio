"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import { notificationService } from "./notification.service";

import type {
  Notification,
} from "./notification.types";

interface NotificationContextValue {

  notifications: Notification[];

  unreadCount: number;

  loading: boolean;

  markAsRead: (
    notificationId: string
  ) => Promise<void>;

}

const NotificationContext =
createContext<NotificationContextValue>({

  notifications: [],

  unreadCount: 0,

  loading: true,

  markAsRead: async () => {},

});

export function NotificationProvider({

  children,

}:{

  children:ReactNode;

}){

    async function markAsRead(

  notificationId: string

) {

  await notificationService.markAsRead(

    notificationId

  );

}

  const {workspace}=useWorkspace();

  const[
    notifications,
    setNotifications,
  ]=useState<Notification[]>([]);

  const[
    loading,
    setLoading,
  ]=useState(true);

  useEffect(()=>{

    if(!workspace){

      setNotifications([]);

      setLoading(false);

      return;

    }

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

  },[workspace]);

  const unreadCount=

    notifications.filter(

      n=>!n.isRead

    ).length;

  const value=useMemo(

    ()=>({

      notifications,

      unreadCount,

      loading,

      markAsRead,

    }),

    [

      notifications,

      unreadCount,

      loading,

    ]

  );

  return(

    <NotificationContext.Provider
      value={value}
    >

      {children}

    </NotificationContext.Provider>

  );

}

export function useNotification(){

  return useContext(
    NotificationContext
  );

}