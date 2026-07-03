import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import {
  SubscriptionPayment,
} from "./subscription-payment.types";

export class SubscriptionPaymentRepository {

  async create(
    payment: SubscriptionPayment
  ) {

    await setDoc(

      doc(
        db,
        "subscription-payments",
        payment.paymentId
      ),

      payment

    );

  }

  async findById(
    paymentId: string
  ) {

    const snapshot =
      await getDoc(

        doc(
          db,
          "subscription-payments",
          paymentId
        )

      );

    if (!snapshot.exists()) {

      return null;

    }

    const data = snapshot.data();

return {
  paymentId: data.paymentId,
  companyId: data.companyId,
  companyName: data.companyName,
  ownerId: data.ownerId,
  ownerName: data.ownerName,
  ownerEmail: data.ownerEmail,
  previousPlan: data.previousPlan,
  nextPlan: data.nextPlan,
  amount: data.amount,
  paymentMethod: data.paymentMethod,
  proofImage: data.proofImage,
  status: data.status,
  createdAt: data.createdAt,
  approvedAt: data.approvedAt,
  approvedBy: data.approvedBy,
} satisfies SubscriptionPayment;

  }

  async updateStatus(

    paymentId: string,

    data: {

      status:
        "pending"
        | "approved"
        | "rejected";

      approvedBy:
        string | null;

      approvedAt:
        Date | null;

    }

  ) {

    await updateDoc(

      doc(
        db,
        "subscription-payments",
        paymentId
      ),

      data

    );

  }

  async getLatestByCompany(

    companyId: string

  ) {

    const q = query(

      collection(
        db,
        "subscription-payments"
      ),

      where(
        "companyId",
        "==",
        companyId
      ),

      orderBy(
        "createdAt",
        "desc"
      ),

      limit(1)

    );

    const snapshot =
  await getDocs(q);

if (snapshot.empty) {
  return null;
}

const data =
  snapshot.docs[0].data();

return {
  paymentId: data.paymentId,
  companyId: data.companyId,
  companyName: data.companyName,
  ownerId: data.ownerId,
  ownerName: data.ownerName,
  ownerEmail: data.ownerEmail,
  previousPlan: data.previousPlan,
  nextPlan: data.nextPlan,
  amount: data.amount,
  paymentMethod: data.paymentMethod,
  proofImage: data.proofImage,
  status: data.status,
  createdAt: data.createdAt,
  approvedAt: data.approvedAt,
  approvedBy: data.approvedBy,
} satisfies SubscriptionPayment;

  }

}
export const subscriptionPaymentRepository =
new SubscriptionPaymentRepository();