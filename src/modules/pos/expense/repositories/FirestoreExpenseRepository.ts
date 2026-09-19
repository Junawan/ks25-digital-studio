import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import {
  CreateExpenseInput,
  Expense,
  UpdateExpenseInput,
} from "../types/expense";

import { ExpenseRepository }
from "./ExpenseRepository";

export class FirestoreExpenseRepository
  implements ExpenseRepository
{
  private readonly collectionName =
    "pos_expenses";

  async create(
    input: CreateExpenseInput
  ): Promise<Expense> {

    const expenseId =
      crypto.randomUUID();

    const now =
      new Date();

    const expense: Expense = {
      expenseId,

      companyId:
        input.companyId,

      source:
        input.source,

      amount:
        input.amount,

      description:
        input.description ?? "",

      date:
        input.date,

      createdAt:
        now,

      updatedAt:
        now,
    };

    await setDoc(
      doc(
        db,
        this.collectionName,
        expenseId
      ),
      {
        ...expense,

        date:
          Timestamp.fromDate(
            input.date
          ),

        createdAt:
          Timestamp.fromDate(
            now
          ),

        updatedAt:
          Timestamp.fromDate(
            now
          ),
      }
    );

    return expense;
  }

  async getAll(
    companyId: string
  ): Promise<Expense[]> {

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
          )
        )
      );

    return snapshot.docs.map(
      (document) => {

        const data =
          document.data();

        const createdAt =
          data.createdAt
            ?.toDate?.() ??
          new Date();

        const date =
          data.date
            ?.toDate?.() ??
          createdAt;

        const updatedAt =
          data.updatedAt
            ?.toDate?.() ??
          createdAt;

        return {
          ...data,

          date,

          createdAt,

          updatedAt,

        } as Expense;
      }
    );
  }

  async getByMonth(
    companyId: string,
    year: number,
    month: number
  ): Promise<Expense[]> {

    /*
     * Untuk menjaga data lama yang belum
     * mempunyai field "date", kita ambil
     * seluruh pengeluaran perusahaan lalu
     * menentukan tanggal transaksi di sini.
     *
     * Data baru:
     *   date
     *
     * Data lama:
     *   createdAt sebagai fallback
     */

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
          )
        )
      );

    const startDate =
      new Date(
        year,
        month,
        1
      );

    const endDate =
      new Date(
        year,
        month + 1,
        1
      );

    return snapshot.docs
      .map((document) => {

        const data =
          document.data();

        const createdAt =
          data.createdAt
            ?.toDate?.() ??
          new Date();

        const date =
          data.date
            ?.toDate?.() ??
          createdAt;

        const updatedAt =
          data.updatedAt
            ?.toDate?.() ??
          createdAt;

        return {
          ...data,

          date,

          createdAt,

          updatedAt,

        } as Expense;
      })
      .filter((expense) => {

        return (
          expense.date >=
            startDate &&
          expense.date <
            endDate
        );

      })
      .sort(
        (a, b) =>
          b.date.getTime() -
          a.date.getTime()
      );
  }

  async update(
    expenseId: string,
    input: UpdateExpenseInput
  ): Promise<void> {

    await updateDoc(
      doc(
        db,
        this.collectionName,
        expenseId
      ),
      {
        source:
          input.source,

        amount:
          input.amount,

        description:
          input.description ?? "",

        date:
          Timestamp.fromDate(
            input.date
          ),

        updatedAt:
          Timestamp.fromDate(
            new Date()
          ),
      }
    );
  }

  async delete(
    expenseId: string
  ): Promise<void> {

    await deleteDoc(
      doc(
        db,
        this.collectionName,
        expenseId
      )
    );
  }
}