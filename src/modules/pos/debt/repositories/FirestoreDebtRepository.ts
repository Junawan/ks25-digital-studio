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

import {
  Debt,
  DebtStatus,
} from "../types/debt";

import { DebtRepository } from "./DebtRepository";

export class FirestoreDebtRepository
  implements DebtRepository
{
  private readonly collectionName =
    "pos_debts";

  async create(
    debt: Debt
  ): Promise<Debt> {
    await setDoc(
      doc(
        collection(
          db,
          this.collectionName
        ),
        debt.debtId
      ),
      debt
    );

    return debt;
  }

  async getAll(
    companyId: string
  ): Promise<Debt[]> {
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
      (item) =>
        item.data() as Debt
    );
  }

  async getById(
    debtId: string
  ): Promise<Debt | null> {
    const snapshot =
      await getDoc(
        doc(
          db,
          this.collectionName,
          debtId
        )
      );

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as Debt;
  }

  async update(
    debt: Debt
  ): Promise<void> {
    await setDoc(
      doc(
        db,
        this.collectionName,
        debt.debtId
      ),
      debt,
      {
        merge: true,
      }
    );
  }

  async delete(
    debtId: string
  ): Promise<void> {
    await deleteDoc(
      doc(
        db,
        this.collectionName,
        debtId
      )
    );
  }

  async getByStatus(
    companyId: string,
    status: DebtStatus | "all"
  ): Promise<Debt[]> {
    if (status === "all") {
      return this.getAll(companyId);
    }

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
          where(
            "status",
            "==",
            status
          ),
          orderBy(
            "createdAt",
            "desc"
          )
        )
      );

    return snapshot.docs.map(
      (item) =>
        item.data() as Debt
    );
  }
}