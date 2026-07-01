import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "@/core/firebase";
import type { CompanyModule } from "./module.types";

export class CompanyModuleRepository {
  async install(companyId: string, moduleId: string) {
    await setDoc(
      doc(
    db,
    "company_modules",
    `${companyId}_${moduleId}`
),
      {
        companyId,
        moduleId,
        enabled: true,
        installedAt: new Date(),
      }
    );
  }

  async getInstalled(
  companyId: string
): Promise<CompanyModule[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "company_modules"),
      where("companyId", "==", companyId)
    )
  );

  return snapshot.docs.map(
    (doc) => doc.data() as CompanyModule
  );
}

}

export const companyModuleRepository =
  new CompanyModuleRepository();