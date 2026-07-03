import { subscriptionPaymentRepository } from "./subscription-payment.repository";

import { SubscriptionPayment } from "./subscription-payment.types";

export class SubscriptionPaymentService {

  async create(
    payment: SubscriptionPayment
  ) {

    return subscriptionPaymentRepository.create(
      payment
    );

  }

}

export const subscriptionPaymentService =
  new SubscriptionPaymentService();