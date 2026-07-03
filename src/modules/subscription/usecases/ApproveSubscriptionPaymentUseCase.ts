import { companyService } from "@/modules/company/company.service";

import { subscriptionPaymentRepository } from "../subscription-payment.repository";

import { createNotificationUseCase } from "@/modules/notification/usecases/CreateNotificationUseCase";

export class ApproveSubscriptionPaymentUseCase {

  async execute(

  paymentId: string,

  adminUserId: string

) {

    const now = new Date();

    const expired = new Date(now);

    // sementara semua paket berlaku 30 hari
    expired.setDate(expired.getDate() + 30);

    const payment =
  await subscriptionPaymentRepository.findById(
    paymentId
  );

if (!payment) {
  throw new Error(
    "Payment tidak ditemukan."
  );
}

    // update status pembayaran
    await subscriptionPaymentRepository.updateStatus(

      paymentId,

      {

        status: "approved",

        approvedBy: adminUserId,

        approvedAt: now,

      }

    );

    // update paket perusahaan
    await companyService.updatePlan(

  payment.companyId,

  {

    plan: payment.nextPlan,

    planStartedAt: now,

    planExpiresAt: expired,

  }

);

    await createNotificationUseCase.execute({

  companyId:
    payment.companyId,

  receiverId:
    payment.ownerId,

  receiverType:
    "user",

  module:
    "subscription",

  type:
    "subscription",

  priority:
    "normal",

  title:
    "Langganan Disetujui",

  message:
    `Paket ${payment.nextPlan.toUpperCase()} telah aktif.`,

  actionUrl:
    "/dashboard/subscription",

  sourceId:
    payment.paymentId,

  isRead:
    false,

});

  }

}

export const approveSubscriptionPaymentUseCase =
  new ApproveSubscriptionPaymentUseCase();