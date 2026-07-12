export class InvalidVariantError extends Error {
  readonly name = "InvalidVariantError";

  constructor(message: string) {
    super(message);
  }
}