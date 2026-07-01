import { subscriptionRepository } from "./subscription.repository";

import type { Subscription } from "./subscription.types";

export class SubscriptionService {
  async create(subscription: Subscription) {
    return subscriptionRepository.create(subscription);
  }

  async getActiveByCompanyId(companyId: string) {
  return subscriptionRepository.getActiveByCompanyId(
    companyId
  );
}
}

export const subscriptionService =
  new SubscriptionService();