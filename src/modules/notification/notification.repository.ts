import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth, db } from "@/core/firebase";

import type { Notification } from "./notification.types";

async function requestRemoteDelivery(notificationId: string) {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const token = await user.getIdToken();
    const response = await fetch("/api/notifications/push", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ notificationId }),
    });
    if (!response.ok) console.warn("Push notification delivery was not accepted:", response.status);
  } catch (error) {
    console.warn("Push notification delivery could not be requested:", error);
  }
}

export class NotificationRepository {

  async broadcastCompany(
    companyId: string,
    notification: Omit<Notification, "notificationId" | "receiverId" | "receiverType" | "companyId" | "createdAt" | "isRead" | "readBy">,
  ) {
    const notificationRef = doc(collection(db, "notifications"));
    await setDoc(notificationRef, {
      ...notification,
      notificationId: notificationRef.id,
      companyId,
      receiverId: null,
      receiverType: "company",
      isRead: false,
      readBy: [],
      createdAt: new Date(),
    } satisfies Notification);
    await requestRemoteDelivery(notificationRef.id);
  }

  async createForCompany(
    companyId: string,
    receiverId: string,
    notification: Omit<Notification, "notificationId" | "receiverId" | "receiverType" | "companyId" | "createdAt" | "isRead">,
  ) {
    const notificationRef = doc(collection(db, "notifications"));
    await setDoc(notificationRef, {
      ...notification,
      notificationId: notificationRef.id,
      companyId,
      receiverId,
      receiverType: "user",
      isRead: false,
      createdAt: new Date(),
    } satisfies Notification);
    await requestRemoteDelivery(notificationRef.id);

    return 1;
  }

  async create(
  notification: Notification
) {

  await setDoc(

    doc(
      db,
      "notifications",
      notification.notificationId
    ),

    notification

  );
  await requestRemoteDelivery(notification.notificationId);

}

  async findById(
    notificationId: string
  ) {

    const snapshot =
      await getDoc(

        doc(
          db,
          "notifications",
          notificationId
        )

      );

    if (!snapshot.exists()) {

      return null;

    }

    return snapshot.data() as Notification;

  }

  async getSystemNotifications() {

  const q = query(

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

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(

    (doc) =>
      doc.data() as Notification

  );

}

async getUserNotifications(

  companyId: string,

  userId: string

) {

  const q = query(

    collection(
      db,
      "notifications"
    ),

    where(
      "companyId",
      "==",
      companyId
    ),

    where(
      "receiverType",
      "==",
      "user"
    ),

    where(
      "receiverId",
      "==",
      userId
    ),

    orderBy(
      "createdAt",
      "desc"
    )

  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(

    (doc)=>

      doc.data() as Notification

  );

}

async getSystemUnreadCount() {

  const q=query(

    collection(
      db,
      "notifications"
    ),

    where(
      "receiverType",
      "==",
      "system-admin"
    ),

    where(
      "isRead",
      "==",
      false
    )

  );

  const snapshot=
    await getDocs(q);

  return snapshot.size;

}

async getUserUnreadCount(

  companyId:string,

  userId:string

){

  const q=query(

    collection(
      db,
      "notifications"
    ),

    where(
      "companyId",
      "==",
      companyId
    ),

    where(
      "receiverType",
      "==",
      "user"
    ),

    where(
      "receiverId",
      "==",
      userId
    ),

    where(
      "isRead",
      "==",
      false
    )

  );

  const snapshot=
    await getDocs(q);

  return snapshot.size;

}

  async getLatest(

    companyId: string,

    userId: string

  ) {

    const q = query(

      collection(
        db,
        "notifications"
      ),

      where(
        "companyId",
        "==",
        companyId
      ),

      where(
        "targetUserId",
        "==",
        userId
      ),

      orderBy(
        "createdAt",
        "desc"
      ),

      limit(20)

    );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(

      (doc) =>
        doc.data() as Notification

    );

  }

  async markAsRead(notificationId: string, userId?: string) {
    const reference = doc(db, "notifications", notificationId);
    const snapshot = await getDoc(reference);
    if (snapshot.data()?.receiverType === "company" && userId) {
      await updateDoc(reference, { readBy: arrayUnion(userId) });
    } else {
      await updateDoc(reference, { isRead: true });
    }
  }

}
export const notificationRepository =
new NotificationRepository();
