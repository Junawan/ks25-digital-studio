import {
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

import { db } from "@/core/firebase";

import type { Notification } from "./notification.types";

export class NotificationRepository {

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

  async markAsRead(
    notificationId: string
  ) {

    await updateDoc(

      doc(
        db,
        "notifications",
        notificationId
      ),

      {

        isRead: true,

      }

    );

  }

}
export const notificationRepository =
new NotificationRepository();