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

import { CashierRepository } from "./CashierRepository";
import { db } from "@/core/firebase";
import { Cashier } from "../types/cashier";

export class FirestoreCashierRepository
  implements CashierRepository
{
  private readonly collectionName =
    "pos_cashiers";

  async getAll(
    companyId: string
  ): Promise<Cashier[]> {
    const snapshot = await getDocs(
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
        orderBy("name")
      )
    );

    return snapshot.docs.map(
      (doc) =>
        doc.data() as Cashier
    );
  }

  async create(
    cashier: Cashier
  ): Promise<void> {
    await setDoc(
      doc(
        db,
        this.collectionName,
        cashier.cashierId
      ),
      cashier
    );
  }

  async update(
    cashier: Cashier
  ): Promise<void> {
    await setDoc(
      doc(
        db,
        this.collectionName,
        cashier.cashierId
      ),
      cashier
    );
  }

  async delete(
    cashierId: string
  ): Promise<void> {
    await deleteDoc(
      doc(
        db,
        this.collectionName,
        cashierId
      )
    );
  }

  async findByName(
  companyId: string,
  nameLower: string
): Promise<Cashier | null> {
  const snapshot = await getDocs(
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
      where(
        "nameLower",
        "==",
        nameLower
      )
    )
  );

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data() as Cashier;
}

async findById(
  cashierId: string
): Promise<Cashier | null> {
  const snapshot = await getDoc(
    doc(
      db,
      this.collectionName,
      cashierId
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as Cashier;
}
}