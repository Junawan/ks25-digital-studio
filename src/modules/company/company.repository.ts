import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@/core/firebase";
import type { Company } from "@/modules/company/company.types";

export class CompanyRepository {
  async create(company: Company) {
    await setDoc(doc(db, "companies", company.id), company);
  }

  async getById(companyId: string) {
  const snapshot = await getDoc(
    doc(db, "companies", companyId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as Company;
}
}

export const companyRepository = new CompanyRepository();