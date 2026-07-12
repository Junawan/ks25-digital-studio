export class ProductAlreadyExistsError extends Error {
  readonly name = "ProductAlreadyExistsError";

  constructor(productName: string) {
    super(`Produk "${productName}" sudah ada.`);
  }
}