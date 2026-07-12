import { importProductsUseCase } from "@/modules/live-assistant/di";
import { FirestoreProductRepository } from "../repository/FirestoreProductRepository";

import { CreateProductUseCase } from "../usecases/CreateProductUseCase";
import { DeleteProductUseCase } from "../usecases/DeleteProductUseCase";
import { GetProductsUseCase } from "../usecases/GetProductsUseCase";
import { SaveVariantsUseCase } from "../usecases/SaveVariantsUseCase";
import { SearchProductsUseCase } from "../usecases/SearchProductsUseCase";
import { UpdateProductUseCase } from "../usecases/UpdateProductUseCase";
import { ImportProductsUseCase } from "../usecases/ImportProductUseCase";
import { ExportProductsUseCase } from "../usecases/ExportProductsUseCase";


const repository = new FirestoreProductRepository();

export const productDI = {
  repository,

  createProductUseCase: new CreateProductUseCase(repository),

  updateProductUseCase: new UpdateProductUseCase(repository),

  deleteProductUseCase: new DeleteProductUseCase(repository),

  getProductsUseCase: new GetProductsUseCase(repository),

  searchProductsUseCase: new SearchProductsUseCase(repository),

  saveVariantsUseCase: new SaveVariantsUseCase(repository),

  importProductsUseCase: new ImportProductsUseCase(repository),

  exportProductsUseCase:
    new ExportProductsUseCase(repository),
};