import {
    doc,
    setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import type { Subscription } from "./subscription.types";

export class SubscriptionRepository {
  async create(subscription: Subscription) {
    await setDoc(
      doc(db, "subscriptions", subscription.subscriptionId),
      subscription
    );
  }

  async getActiveByCompanyId(companyId: string) {
  const snapshot = await getDocs(
    query(
      collection(db, "subscriptions"),
      where("companyId", "==", companyId),
      where("status", "==", "active")
    )
  );

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data() as Subscription;
}
}

export const subscriptionRepository =
  new SubscriptionRepository();