import { ScannerService } from "../service/ScannerService";

import { RealtimeScannerRepository }
  from "../repository/RealtimeScannerRepository";
import { UsbHidScannerAdapter } from "../adapters/UsbHidScannerAdapter";

const repository =
  new RealtimeScannerRepository();

export const scannerDI = {
  repository,

  scannerService:
    new ScannerService(repository),
};

export const usbScanner =
  new UsbHidScannerAdapter();