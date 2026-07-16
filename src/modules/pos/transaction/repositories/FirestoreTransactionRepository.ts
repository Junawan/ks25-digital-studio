import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import { Transaction } from "../types/transaction";
import { TransactionRepository } from "./TransactionRepository";

export class FirestoreTransactionRepository
  implements TransactionRepository
{
  private readonly collectionName =
    "pos_transactions";

  async create(
    transaction: Transaction
  ): Promise<Transaction> {
    await setDoc(
      doc(
        collection(
          db,
          this.collectionName
        ),
        transaction.transactionId
      ),
      transaction
    );

    return transaction;
  }

  async getAll(
  companyId: string
): Promise<Transaction[]> {

  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          this.collectionName
        ),
        where(
          "companyId",
          "==",
          companyId
        ),
        orderBy(
          "createdAt",
          "desc"
        )
      )
    );

  return snapshot.docs.map(
    (doc) =>
      doc.data() as Transaction
  );

}

async getById(
  transactionId: string
): Promise<Transaction | null> {

  const snapshot =
    await getDoc(
      doc(
        db,
        this.collectionName,
        transactionId
      )
    );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as Transaction;

}

async delete(
  transactionId: string
): Promise<void> {

  await deleteDoc(
    doc(
      db,
      this.collectionName,
      transactionId
    )
  );

}
}