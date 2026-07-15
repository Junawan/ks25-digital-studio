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

  markReceived(
  companyId: string,
  workstationId: string
) {
  return this.repository.markReceived(
    companyId,
    workstationId
  );
}

waitUntilReceived(
  companyId: string,
  workstationId: string
): Promise<void> {

  return new Promise((resolve) => {

    const unsubscribe =
      this.waitForScan(
        companyId,
        workstationId,
        (session) => {

          if (
            session.status !==
            "received"
          ) {
            return;
          }

          unsubscribe();

          resolve();

        }
      );

  });

}
}