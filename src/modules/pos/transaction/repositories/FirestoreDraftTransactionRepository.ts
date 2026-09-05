import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import type { DraftTransaction } from "../types/draftTransaction";
import type { DraftTransactionRepository } from "./DraftTransactionRepository";
import { db } from "@/core/firebase";

export class FirestoreDraftTransactionRepository
  implements DraftTransactionRepository
{
  private readonly collectionName =
    "pos_draft_transactions";

  async create(
    draft: DraftTransaction
  ): Promise<DraftTransaction> {
    await setDoc(
      doc(
        db,
        this.collectionName,
        draft.draftId
      ),
      draft
    );

    return draft;
  }

  async getAll(
    companyId: string
  ): Promise<DraftTransaction[]> {
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
      (item) => {
        const data =
          item.data() as DraftTransaction;

        return {
          ...data,

          draftId: item.id,

          createdAt:
            data.createdAt instanceof Date
              ? data.createdAt
              : new Date(
                  (
                    data.createdAt as any
                  )?.seconds
                    ? (
                        data.createdAt as any
                      ).seconds * 1000
                    : Date.now()
                ),

          updatedAt:
            data.updatedAt instanceof Date
              ? data.updatedAt
              : new Date(
                  (
                    data.updatedAt as any
                  )?.seconds
                    ? (
                        data.updatedAt as any
                      ).seconds * 1000
                    : Date.now()
                ),
        };
      }
    );
  }

  async getById(
    draftId: string
  ): Promise<DraftTransaction | null> {
    const snapshot =
      await getDoc(
        doc(
          db,
          this.collectionName,
          draftId
        )
      );

    if (!snapshot.exists()) {
      return null;
    }

    const data =
      snapshot.data() as DraftTransaction;

    return {
      ...data,

      draftId: snapshot.id,

      createdAt:
        data.createdAt instanceof Date
          ? data.createdAt
          : new Date(
              (
                data.createdAt as any
              )?.seconds
                ? (
                    data.createdAt as any
                  ).seconds * 1000
                : Date.now()
            ),

      updatedAt:
        data.updatedAt instanceof Date
          ? data.updatedAt
          : new Date(
              (
                data.updatedAt as any
              )?.seconds
                ? (
                    data.updatedAt as any
                  ).seconds * 1000
                : Date.now()
            ),
    };
  }

  async update(
    draft: DraftTransaction
  ): Promise<DraftTransaction> {
    await setDoc(
      doc(
        db,
        this.collectionName,
        draft.draftId
      ),
      draft
    );

    return draft;
  }

  async delete(
    draftId: string
  ): Promise<void> {
    await deleteDoc(
      doc(
        db,
        this.collectionName,
        draftId
      )
    );
  }
}