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

import { ExpenseRepository } from "./ExpenseRepository";

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

      createdAt: now,

      updatedAt: now,
    };

    await setDoc(
      doc(
        db,
        this.collectionName,
        expenseId
      ),
      expense
    );

    return expense;
  }

  async getAll(
  companyId: string
): Promise<Expense[]> {
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
      )
    )
  );

  return snapshot.docs.map(
    (doc) =>
      doc.data() as Expense
  );
}

  async getByMonth(
    companyId: string,
    year: number,
    month: number
  ): Promise<Expense[]> {

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
            "createdAt",
            ">=",
            Timestamp.fromDate(
              startDate
            )
          ),

          where(
            "createdAt",
            "<",
            Timestamp.fromDate(
              endDate
            )
          ),

          orderBy(
            "createdAt",
            "desc"
          )
        )
      );

    return snapshot.docs.map(
      (document) => {

        const data =
          document.data();

        return {
          ...data,

          createdAt:
            data.createdAt?.toDate?.() ??
            new Date(),

          updatedAt:
            data.updatedAt?.toDate?.() ??
            new Date(),
        } as Expense;
      }
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

        updatedAt:
          new Date(),
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