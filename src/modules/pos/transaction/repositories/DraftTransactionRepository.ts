import type { DraftTransaction } from "../types/draftTransaction";

export interface DraftTransactionRepository {
  create(
    draft: DraftTransaction
  ): Promise<DraftTransaction>;

  getAll(
    companyId: string
  ): Promise<DraftTransaction[]>;

  getById(
    draftId: string
  ): Promise<DraftTransaction | null>;

  update(
    draft: DraftTransaction
  ): Promise<DraftTransaction>;

  delete(
    draftId: string
  ): Promise<void>;
}