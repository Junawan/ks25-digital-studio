import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

import {
  CreateProductInput,
  Product,
  ProductVariant,
  UpdateProductInput,
} from "../types/product";
import { ProductNormalizer } from "../utils/ProductNormalizer";

export class ProductMapper {
  static toCreate(input: CreateProductInput) {
  return {
    companyId: input.companyId,
    name: input.name,
    nameLower: ProductNormalizer.normalizeName(input.name),
    active: input.active,

    variants: input.variants.map((variant) => ({
      variantId: crypto.randomUUID(),

      name: variant.name,

      barcode: variant.barcode,

      price: variant.price,

      stock: variant.stock,

      active: variant.active,

      createdAt: new Date(),

      updatedAt: new Date(),
    })),

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

  static toUpdate(input: UpdateProductInput) {
    return {
      ...input,
      updatedAt: serverTimestamp(),
    };
  }

  static fromFirestore(
    snapshot:
      | QueryDocumentSnapshot
      | DocumentSnapshot
  ): Product {
    const data = snapshot.data();

    if (!data) {
      throw new Error("Product not found.");
    }

    return {
      productId: snapshot.id,

      companyId: data.companyId,

      name: data.name,

      variants: (data.variants ?? []).map(
        (variant: any) => ({
          variantId: variant.variantId,

          name: variant.name,

          barcode: variant.barcode ?? "",

          price: variant.price,

          stock: variant.stock,

          active: variant.active,

          createdAt:
            variant.createdAt instanceof Timestamp
              ? variant.createdAt.toDate()
              : new Date(variant.createdAt),

          updatedAt:
            variant.updatedAt instanceof Timestamp
              ? variant.updatedAt.toDate()
              : new Date(variant.updatedAt),
        })
      ),

      active: data.active,

      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date(data.createdAt),

      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate()
          : new Date(data.updatedAt),
    };
  }
}