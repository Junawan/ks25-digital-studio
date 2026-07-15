import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/core/firebase";

import { ProductMapper } from "../mapper/ProductMapper";

import {
  CreateProductInput,
  Product,
  ProductVariantForm,
  UpdateProductInput,
} from "../types/product";

import { ProductRepository } from "./ProductRepository";

export class FirestoreProductRepository
  implements ProductRepository
{
  private readonly collectionName = "pos_products";

  async create(
    input: CreateProductInput
  ): Promise<Product> {
    const ref = await addDoc(
      collection(db, this.collectionName),
      ProductMapper.toCreate(input)
    );

    const snapshot = await getDoc(ref);

    return ProductMapper.fromFirestore(snapshot);
  }

  async update(
    productId: string,
    input: UpdateProductInput
  ): Promise<Product> {
    const ref = doc(
      db,
      this.collectionName,
      productId
    );

    await updateDoc(ref, ProductMapper.toUpdate(input));

    const snapshot = await getDoc(ref);

    return ProductMapper.fromFirestore(snapshot);
  }

  async delete(productId: string): Promise<void> {
    await deleteDoc(
      doc(db, this.collectionName, productId)
    );
  }

  async findById(
    productId: string
  ): Promise<Product | null> {
    const snapshot = await getDoc(
      doc(db, this.collectionName, productId)
    );

    if (!snapshot.exists()) {
      return null;
    }

    return ProductMapper.fromFirestore(snapshot);
  }

  async findAll(
    companyId: string
  ): Promise<Product[]> {
    const q = query(
      collection(db, this.collectionName),
      where("companyId", "==", companyId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(ProductMapper.fromFirestore);
  }

  async search(
    companyId: string,
    keyword: string
  ): Promise<Product[]> {
    const products = await this.findAll(companyId);

    const q = keyword.trim().toLowerCase();

    if (!q) {
      return products;
    }

    return products.filter((product) => {
      if (product.name.toLowerCase().includes(q)) {
        return true;
      }

      return product.variants.some((variant) => {
        if (
          variant.name
            .toLowerCase()
            .includes(q)
        ) {
          return true;
        }

        if (
          variant.barcode &&
          variant.barcode.includes(q)
        ) {
          return true;
        }

        return false;
      });
    });
  }

  async findByName(
  companyId: string,
  name: string
): Promise<Product | null> {
  const q = query(
    collection(db, this.collectionName),
    where("companyId", "==", companyId),
    where("name", "==", name)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return ProductMapper.fromFirestore(snapshot.docs[0]);
}

async findByBarcode(
  companyId: string,
  barcode: string
) {
  const products =
    await this.findAll(companyId);

  for (const product of products) {

    const variant =
      product.variants.find(
        (item) =>
          item.barcode === barcode
      );

    if (variant) {
      return {
        product,
        variant,
      };
    }

  }

  return null;
}
}