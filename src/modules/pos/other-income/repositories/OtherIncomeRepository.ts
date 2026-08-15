import { OtherIncome } from "../types/otherIncome";

export interface OtherIncomeRepository {
  create(
    income: OtherIncome
  ): Promise<OtherIncome>;

  getAll(
    companyId: string
  ): Promise<OtherIncome[]>;

  update(
    income: OtherIncome
  ): Promise<OtherIncome>;

  delete(
    incomeId: string
  ): Promise<void>;
}