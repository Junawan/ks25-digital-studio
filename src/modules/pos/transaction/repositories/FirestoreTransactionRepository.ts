import {
  collection,
  doc,
  setDoc,
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
}