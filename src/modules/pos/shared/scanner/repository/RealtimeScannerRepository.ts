import {
  onValue,
  ref,
  set,
  update,
} from "firebase/database";

import { realtimeDb } from "@/core/firebase";

import { ScannerRepository } from "./ScannerRepository";
import { ScannerSession } from "../types/scanner";

export class RealtimeScannerRepository
  implements ScannerRepository
{
  private getRef(
    companyId: string,
    workstationId: string
  ) {
    return ref(
      realtimeDb,
      `scanner/${companyId}/${workstationId}`
    );
  }

  async initialize(
    companyId: string,
    workstationId: string
  ): Promise<void> {
    await set(
      this.getRef(
        companyId,
        workstationId
      ),
      {
        status: "waiting",
        barcode: "",
        source: "android",
        updatedAt: Date.now(),
      }
    );
  }

  async pairing(
  companyId: string,
  workstationId: string
): Promise<void> {

  await update(
    this.getRef(
      companyId,
      workstationId
    ),
    {
      status: "pairing",
      updatedAt: Date.now(),
    }
  );

}

  waitForScan(
    companyId: string,
    workstationId: string,
    callback: (
      session: ScannerSession
    ) => void
  ): () => void {

    const scannerRef =
      this.getRef(
        companyId,
        workstationId
      );

    const unsubscribe =
      onValue(scannerRef, (snapshot) => {

        if (!snapshot.exists()) {
          return;
        }

        callback(
          snapshot.val() as ScannerSession
        );

      });

    return () => unsubscribe();
  }

  async sendBarcode(
    companyId: string,
    workstationId: string,
    barcode: string,
    source: ScannerSession["source"]
  ): Promise<void> {

    await update(
      this.getRef(
        companyId,
        workstationId
      ),
      {
        status: "scanned",
        barcode,
        source,
        updatedAt: Date.now(),
      }
    );

  }

  async reset(
    companyId: string,
    workstationId: string
  ): Promise<void> {

    await update(
      this.getRef(
        companyId,
        workstationId
      ),
      {
        status: "waiting",
        barcode: "",
        updatedAt: Date.now(),
      }
    );

  }

  async markReceived(
  companyId: string,
  workstationId: string
): Promise<void> {

  await update(
    this.getRef(
      companyId,
      workstationId
    ),
    {
      status: "received",
      updatedAt: Date.now(),
    }
  );

}
}