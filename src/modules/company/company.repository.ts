import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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

async updatePlan(

  companyId: string,

  data: {

    plan: string;

    planStartedAt: Date;

    planExpiresAt: Date;

  }

) {

  await updateDoc(

    doc(
      db,
      "companies",
      companyId
    ),

    {

      ...data,

      updatedAt:
        new Date(),

    }

  );

}

async updateLogo(

  companyId: string,

  logo: string

) {

  await updateDoc(

    doc(
      db,
      "companies",
      companyId
    ),

    {

      logo,

      updatedAt:
        new Date(),

    }

  );

}
}

export const companyRepository = new CompanyRepository();