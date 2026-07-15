export type ScannerSource =
  | "android"
  | "usb"

export type ScannerStatus =
| "pairing"
  | "waiting"
  | "scanned"
  | "received";

export interface ScannerSession {
  status: ScannerStatus;

  barcode: string;

  source: ScannerSource;

  updatedAt: number;
}