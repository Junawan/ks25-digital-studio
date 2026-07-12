export class ProductNormalizer {
  static normalizeName(name: string): string {
    return name.trim().toLowerCase();
  }

  static displayName(name: string): string {
    return name.trim();
  }
}