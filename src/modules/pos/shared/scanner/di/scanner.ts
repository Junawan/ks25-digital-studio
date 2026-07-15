import { ScannerService } from "../service/ScannerService";

import { RealtimeScannerRepository }
  from "../repository/RealtimeScannerRepository";
import { UsbHidScannerAdapter } from "../adapters/UsbHidScannerAdapter";
import { ScannerPairingStorage } from "../service/ScannerPairingStorage";

const repository =
  new RealtimeScannerRepository();

export const scannerDI = {
  repository,

  scannerService:
    new ScannerService(repository),

    pairingStorage:
  new ScannerPairingStorage(),
};

export const usbScanner =
  new UsbHidScannerAdapter();