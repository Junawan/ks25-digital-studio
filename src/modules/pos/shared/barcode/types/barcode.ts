export type BarcodeScanMode =
  | "single"
  | "continuous";

export interface BarcodeScanOptions {
  /**
   * Android:
   * environment = kamera belakang
   * user = kamera depan
   */
  facingMode?:
    | "environment"
    | "user";

  /**
   * Product = single
   * Kasir = continuous
   */
  mode?: BarcodeScanMode;

  /**
   * Bunyi beep setelah scan
   */
  beep?: boolean;

  /**
   * Getar Android setelah scan
   */
  vibrate?: boolean;

  /**
   * Flash jika kamera mendukung
   */
  torch?: boolean;
}

export interface BarcodeScanResult {
  text: string;

  format?: string;

  timestamp: number;
}