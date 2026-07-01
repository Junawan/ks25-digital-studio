import type { FaqItem } from "./faq.types";
export interface Product {
  productId: string;
  companyId: string;

  title: string;
  image: string;
  productInfo: string;

  teleprompterText?: string;
  notes?: string;
  faq: FaqItem[];

  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}