import { doc, setDoc } from "firebase/firestore";

import { db } from "@/core/firebase";
import type { Company } from "@/modules/company/company.types";

export class CompanyRepository {
  async create(company: Company) {
    await setDoc(doc(db, "companies", company.id), company);
  }
}

export const companyRepository = new CompanyRepository();