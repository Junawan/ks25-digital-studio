"use client";

import { useState } from "react";

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { storage } from "@/core/firebase";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import { subscriptionPaymentService } from "../subscription-payment.service";

import {
  createNotificationUseCase,
} from "@/modules/notification/usecases/CreateNotificationUseCase";

export function useUploadSubscriptionPayment() {

  const { workspace } =
    useWorkspace();

  const [loading, setLoading] =
    useState(false);

  async function upload(file: File) {

    if (!workspace) {
      return false;
    }

    try {

      setLoading(true);

      const paymentId =
        crypto.randomUUID();

      const storageRef = ref(
        storage,
        `subscription-payments/${paymentId}`
      );

      await uploadBytes(
        storageRef,
        file
      );

      const proofImage =
        await getDownloadURL(
          storageRef
        );

      await subscriptionPaymentService.create({

    paymentId,

    companyId:
      workspace.company.id,

    companyName:
      workspace.company.name,

    ownerId:
      workspace.user.userId,

    ownerName:
      workspace.user.fullName,

    ownerEmail:
      workspace.user.email,

    previousPlan:
  workspace.company.plan,

nextPlan: "pro",

    amount: 20000,

    paymentMethod: "qris",

    proofImage,

    status: "pending",

    createdAt: new Date(),

    approvedAt: null,

    approvedBy: null,

});

await createNotificationUseCase.execute({

  companyId:
    workspace.company.id,

  receiverType:
  "system-admin",

receiverId:
  null,

  module:
    "subscription",

  type:
    "payment",

  priority:
    "high",

  title:
    "Pembayaran Baru",

  message:
`${workspace.company.name}
mengirim bukti pembayaran
langganan PRO.`,

  actionUrl:
    "/dashboard/admin/subscriptions",

  sourceId:
    paymentId,

  isRead:
    false,

});

      return true;

    } catch (err) {

      console.error(err);

      return false;

    } finally {

      setLoading(false);

    }

  }

  return {

    upload,

    loading,

  };

}