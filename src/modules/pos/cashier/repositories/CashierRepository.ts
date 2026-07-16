import { Cashier } from "../types/cashier";

export interface CashierRepository {
  getAll(
    companyId: string
  ): Promise<Cashier[]>;

  create(
    cashier: Cashier
  ): Promise<void>;

  update(
    cashier: Cashier
  ): Promise<void>;

  delete(
    cashierId: string
  ): Promise<void>;

  findByName(
  companyId: string,
  nameLower: string
): Promise<Cashier | null>;
}