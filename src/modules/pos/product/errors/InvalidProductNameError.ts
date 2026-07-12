export class InvalidProductNameError extends Error {
  readonly name = "InvalidProductNameError";

  constructor() {
    super("Nama produk wajib diisi.");
  }
}