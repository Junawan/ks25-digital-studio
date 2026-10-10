import { productDI } from "@/modules/pos/product/di/product";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";

export async function resolveTransactionHsCodes(transaction: Transaction): Promise<Transaction> {
  const lookups = new Map<string, Promise<string>>();
  const items = await Promise.all(transaction.items.map(async (item) => {
    if (item.hsCode?.trim()) return item;

    let codeLookup = lookups.get(item.productId);
    if (!codeLookup) {
      codeLookup = productDI.repository.findById(item.productId)
        .then((product) => product?.hsCode?.trim() ?? "");
      lookups.set(item.productId, codeLookup);
    }

    return { ...item, hsCode: await codeLookup };
  }));

  return { ...transaction, items };
}
