import { ProductRepository } from "../product.repository";
import { Product } from "../product.types";


export interface CreateProductRequest {
  companyId: string;

  title: string;
  image: string;
  productInfo: string;
}

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(
    request: CreateProductRequest
  ): Promise<void> {
    const now = new Date();

    const product: Product = {
  productId: crypto.randomUUID(),

  companyId: request.companyId,

  title: request.title,

  image: request.image,

  productInfo: request.productInfo,

  teleprompterText: "",

notes: "",

faq: [],

  active: true,

  createdAt: now,

  updatedAt: now,
};

    await this.productRepository.create(product);
  }
}