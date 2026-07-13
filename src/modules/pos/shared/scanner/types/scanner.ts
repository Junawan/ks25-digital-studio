export type ScannerSource =
  | "android"
  | "usb"

export type ScannerStatus =
  | "waiting"
  | "scanned";

export interface ScannerSession {
  status: ScannerStatus;

  barcode: string;

  source: ScannerSource;

  updatedAt: number;
}