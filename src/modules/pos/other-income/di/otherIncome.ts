import { FirestoreOtherIncomeRepository } from "../repositories/FirestoreOtherIncomeRepository";

import { CreateOtherIncomeUseCase } from "../usecases/CreateOtherIncomeUseCase";
import { GetOtherIncomesUseCase } from "../usecases/GetOtherIncomesUseCase";
import { UpdateOtherIncomeUseCase } from "../usecases/UpdateOtherIncomeUseCase";
import { DeleteOtherIncomeUseCase } from "../usecases/DeleteOtherIncomeUseCase";

const repository =
  new FirestoreOtherIncomeRepository();

export const otherIncomeDI = {
  repository,

  createUseCase:
    new CreateOtherIncomeUseCase(
      repository
    ),

  getAllUseCase:
    new GetOtherIncomesUseCase(
      repository
    ),

  updateUseCase:
    new UpdateOtherIncomeUseCase(
      repository
    ),

  deleteUseCase:
    new DeleteOtherIncomeUseCase(
      repository
    ),
};