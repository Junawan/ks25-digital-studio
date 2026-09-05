import { FirestoreDraftTransactionRepository }
  from "../repositories/FirestoreDraftTransactionRepository";

const repository =
  new FirestoreDraftTransactionRepository();

export const draftTransactionDI = {
  repository,
};