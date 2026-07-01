import { FaqItem } from "../faq.types";
import { ProductRepository } from "../product.repository";


export interface UpdateProductRequest {
  productId: string;

  title: string;
  image: string;
  productInfo: string;

  teleprompterText: string;
  notes: string;

  active: boolean;
}

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(
    request: UpdateProductRequest
  ): Promise<void> {
    await this.productRepository.update(
      request.productId,
      {

        title: request.title,

        image: request.image,

        productInfo: request.productInfo,

        notes: request.notes,

        teleprompterText:
          request.teleprompterText,

        active: request.active,

        updatedAt: new Date(),
      }
    );
  }
}