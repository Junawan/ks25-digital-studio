import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import { OtherIncome } from "../types/otherIncome";
import { OtherIncomeRepository } from "./OtherIncomeRepository";

export class FirestoreOtherIncomeRepository
  implements OtherIncomeRepository
{
  private readonly collectionName =
    "pos_other_incomes";

  private mapIncome(
    data: Record<string, any>
  ): OtherIncome {
    return {
      ...data,

      date:
        data.date?.toDate
          ? data.date.toDate()
          : data.date,

      createdAt:
        data.createdAt?.toDate
          ? data.createdAt.toDate()
          : data.createdAt,

      updatedAt:
        data.updatedAt?.toDate
          ? data.updatedAt.toDate()
          : data.updatedAt,
    } as OtherIncome;
  }

  async create(
    income: OtherIncome
  ): Promise<OtherIncome> {
    await setDoc(
      doc(
        db,
        this.collectionName,
        income.incomeId
      ),
      income
    );

    return income;
  }

  async getAll(
    companyId: string
  ): Promise<OtherIncome[]> {
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
            "date",
            "desc"
          )
        )
      );

    return snapshot.docs.map(
      (item) =>
        this.mapIncome(
          item.data()
        )
    );
  }

  async update(
    income: OtherIncome
  ): Promise<OtherIncome> {
    await setDoc(
      doc(
        db,
        this.collectionName,
        income.incomeId
      ),
      income,
      {
        merge: true,
      }
    );

    return income;
  }

  async delete(
    incomeId: string
  ): Promise<void> {
    await deleteDoc(
      doc(
        db,
        this.collectionName,
        incomeId
      )
    );
  }
}