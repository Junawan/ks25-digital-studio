import { ScannerSession } from "../types/scanner";

export interface ScannerRepository {
  initialize(
    companyId: string,
    workstationId: string
  ): Promise<void>;

  waitForScan(
    companyId: string,
    workstationId: string,
    callback: (
      session: ScannerSession
    ) => void
  ): () => void;

  sendBarcode(
    companyId: string,
    workstationId: string,
    barcode: string,
    source: ScannerSession["source"]
  ): Promise<void>;

  reset(
    companyId: string,
    workstationId: string
  ): Promise<void>;
}