export type ScannerSource =
  | "android"
  | "usb"
  | "webcam";

export type ScannerStatus =
  | "waiting"
  | "scanned";

export interface ScannerSession {
  status: ScannerStatus;

  barcode: string;

  source: ScannerSource;

  updatedAt: number;
}