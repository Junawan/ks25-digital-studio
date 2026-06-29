import { subscriptionRepository } from "./subscription.repository";

import type { Subscription } from "./subscription.types";

export class SubscriptionService {
  async create(subscription: Subscription) {
    return subscriptionRepository.create(subscription);
  }
}

export const subscriptionService =
  new SubscriptionService();