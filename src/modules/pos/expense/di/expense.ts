import { FirestoreExpenseRepository }
from "../repositories/FirestoreExpenseRepository";

import { CreateExpenseUseCase }
from "../usecases/CreateExpenseUseCase";

import { GetExpensesUseCase }
from "../usecases/GetExpensesUseCase";

import { UpdateExpenseUseCase }
from "../usecases/UpdateExpenseUseCase";

import { DeleteExpenseUseCase }
from "../usecases/DeleteExpenseUseCase";

const repository =
  new FirestoreExpenseRepository();

export const expenseDI = {

  repository,

  createExpenseUseCase:
    new CreateExpenseUseCase(
      repository
    ),

  getExpensesUseCase:
    new GetExpensesUseCase(
      repository
    ),

  updateExpenseUseCase:
    new UpdateExpenseUseCase(
      repository
    ),

  deleteExpenseUseCase:
    new DeleteExpenseUseCase(
      repository
    ),
};