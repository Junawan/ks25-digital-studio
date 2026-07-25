import { Transaction } from "../types/transaction";

export class TransactionMapper {

  static fromFirestore(data: any): Transaction {
    return {

      ...data,

      createdAt: data.createdAt?.toDate(),

      updatedAt: data.updatedAt?.toDate(),

    };
  }

}