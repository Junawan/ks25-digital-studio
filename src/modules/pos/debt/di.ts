import { FirestoreDebtRepository } from "./repositories/FirestoreDebtRepository";

import { CreateDebtUseCase } from "./usecases/CreateDebtUseCase";
import { GetDebtsUseCase } from "./usecases/GetDebtsUseCase";
import { PayDebtUseCase } from "./usecases/PayDebtUseCase";
import { DeleteDebtUseCase } from "./usecases/DeleteDebtUseCase";

const debtRepository =
  new FirestoreDebtRepository();

export const debtDI = {
  repository:
    debtRepository,

  createDebtUseCase:
    new CreateDebtUseCase(
      debtRepository
    ),

  getDebtsUseCase:
    new GetDebtsUseCase(
      debtRepository
    ),

  payDebtUseCase:
    new PayDebtUseCase(
      debtRepository
    ),

  deleteDebtUseCase:
    new DeleteDebtUseCase(
      debtRepository
    ),
};