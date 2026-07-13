import { ScannerService } from "../service/ScannerService";

import { RealtimeScannerRepository }
  from "../repository/RealtimeScannerRepository";

const repository =
  new RealtimeScannerRepository();

export const scannerDI = {
  repository,

  scannerService:
    new ScannerService(repository),
};