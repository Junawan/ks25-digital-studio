import { doc, setDoc } from "firebase/firestore";

import { db } from "@/core/firebase";

import type { Subscription } from "./subscription.types";

export class SubscriptionRepository {
  async create(subscription: Subscription) {
    await setDoc(
      doc(db, "subscriptions", subscription.id),
      subscription
    );
  }
}

export const subscriptionRepository =
  new SubscriptionRepository();