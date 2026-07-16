import { FirestoreCashierRepository } from "../repositories/FirestoreCashierRepository";

import { UpdateCashierUseCase } from "../usecases/UpdateCashierUseCase";
import { DeleteCashierUseCase } from "../usecases/DeleteCashierUseCase";
import { GetCashiersUseCase } from "../usecases/GetCashierUseCase";
import { CreateCashierUseCase } from "../usecases/CreateCashierUseCase";


const repository =
  new FirestoreCashierRepository();

export const cashierDI = {
  repository,

  getCashiersUseCase:
    new GetCashiersUseCase(
      repository
    ),

  createCashierUseCase:
    new CreateCashierUseCase(
      repository
    ),

  updateCashierUseCase:
    new UpdateCashierUseCase(
      repository
    ),

  deleteCashierUseCase:
    new DeleteCashierUseCase(
      repository
    ),
};