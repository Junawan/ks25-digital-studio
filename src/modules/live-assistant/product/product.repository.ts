import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/core/firebase";
import { Product } from "./product.types";
import { FaqItem } from "./faq.types";
import { BaseRepository } from "../playlist/BaseRepository";

export class ProductRepository extends BaseRepository<Product> {
  private readonly collectionName = "products";

  async create(data: Product): Promise<void> {
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(
      ([_, value]) => value !== undefined
    )
  );

  await setDoc(
    doc(db, this.collectionName, data.productId),
    cleanData
  );
}

async createBatch(
  products: Product[],
  onProgress?: (
    current: number,
    total: number
  ) => void
): Promise<void> {

  const chunkSize = 500;

  let current = 0;

  for (
    let i = 0;
    i < products.length;
    i += chunkSize
  ) {

    const batch = writeBatch(db);

    const chunk = products.slice(
      i,
      i + chunkSize
    );

    for (const product of chunk) {

      const cleanData =
        Object.fromEntries(
          Object.entries(product).filter(
            ([_, value]) =>
              value !== undefined
          )
        );

      batch.set(
        doc(
          db,
          this.collectionName,
          product.productId
        ),
        cleanData
      );

      current++;
    }

    await batch.commit();

    onProgress?.(
      current,
      products.length
    );
  }
}

  async update(
    id: string,
    data: Partial<Product>
  ): Promise<void> {
    await updateDoc(
      doc(db, this.collectionName, id),
      data
    );
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(
      doc(db, this.collectionName, id)
    );
  }

  async findById(
    id: string
  ): Promise<Product | null> {
    const snapshot = await getDoc(
      doc(db, this.collectionName, id)
    );

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as Product;
  }

  async findByCompanyId(
    companyId: string
  ): Promise<Product[]> {
    const q = query(
      collection(db, this.collectionName),
      where("companyId", "==", companyId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) => doc.data() as Product
    );
  }

  async findAll(): Promise<Product[]> {
    const snapshot = await getDocs(
      collection(db, this.collectionName)
    );

    return snapshot.docs.map(
      (doc) => doc.data() as Product
    );
  }

  async countByCompany(
  companyId: string
): Promise<number> {
  const q = query(
    collection(db, this.collectionName),
    where("companyId", "==", companyId)
  );

  const snapshot = await getDocs(q);

  return snapshot.size;
}

async updateAI(
  productId: string,
  data: {
    teleprompterText: string;
    notes: string;
    faq: FaqItem[];
  }
): Promise<void> {
  await updateDoc(
    doc(db, this.collectionName, productId),
    {
      teleprompterText: data.teleprompterText,
      notes: data.notes,
      faq: data.faq,
      updatedAt: new Date(),
    }
  );
}

async findByIds(
  productIds: string[]
): Promise<Product[]> {

  if (!productIds.length) {
    return [];
  }

  const products = await Promise.all(
    productIds.map((id) => this.findById(id))
  );

  return products.filter(
    (p): p is Product => p !== null
  );
}
}

export const productRepository =
  new ProductRepository();