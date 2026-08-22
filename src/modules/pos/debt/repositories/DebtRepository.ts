import {
  Debt,
  DebtStatus,
} from "../types/debt";

export interface DebtRepository {
  create(
    debt: Debt
  ): Promise<Debt>;

  getAll(
    companyId: string
  ): Promise<Debt[]>;

  getById(
    debtId: string
  ): Promise<Debt | null>;

  update(
    debt: Debt
  ): Promise<void>;

  delete(
    debtId: string
  ): Promise<void>;

  getByStatus(
    companyId: string,
    status: DebtStatus | "all"
  ): Promise<Debt[]>;
}