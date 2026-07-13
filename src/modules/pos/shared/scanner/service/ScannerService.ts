import { ScannerRepository } from "../repository/ScannerRepository";

export class ScannerService {
  constructor(
    private readonly repository: ScannerRepository
  ) {}

  initialize(
    companyId: string,
    workstationId: string
  ) {
    return this.repository.initialize(
      companyId,
      workstationId
    );
  }

  waitForScan(
    companyId: string,
    workstationId: string,
    callback: Parameters<
      ScannerRepository["waitForScan"]
    >[2]
  ) {
    return this.repository.waitForScan(
      companyId,
      workstationId,
      callback
    );
  }

  sendBarcode(
    companyId: string,
    workstationId: string,
    barcode: string,
    source:
      | "android"
      | "usb"
      | "webcam"
  ) {
    return this.repository.sendBarcode(
      companyId,
      workstationId,
      barcode,
      source
    );
  }

  reset(
    companyId: string,
    workstationId: string
  ) {
    return this.repository.reset(
      companyId,
      workstationId
    );
  }
}