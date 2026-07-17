import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import { PosSettings } from "../types/PosSettings";
import { PosSettingsRepository } from "./PosSettingsRepository";

export class FirestorePosSettingsRepository
  implements PosSettingsRepository
{
  private readonly collectionName =
    "pos_settings";

  async get(
    companyId: string
  ): Promise<PosSettings | null> {

    const snapshot =
      await getDoc(
        doc(
          db,
          this.collectionName,
          companyId
        )
      );

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as PosSettings;

  }

  async save(
    settings: PosSettings
  ): Promise<void> {

    await setDoc(
      doc(
        db,
        this.collectionName,
        settings.companyId
      ),
      settings,
      {
        merge: true,
      }
    );

  }
}