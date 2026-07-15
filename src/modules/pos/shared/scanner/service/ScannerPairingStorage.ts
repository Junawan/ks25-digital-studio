import { Preferences } from "@capacitor/preferences";

const KEY = "scanner_pairing";

export interface ScannerPairing {

  companyId: string;

  workstationId: string;

}

export class ScannerPairingStorage {

  async save(
    pairing: ScannerPairing
  ) {

    await Preferences.set({

      key: KEY,

      value: JSON.stringify(pairing),

    });

  }

  async load() {

    const result =
      await Preferences.get({

        key: KEY,

      });

    if (!result.value) {

      return null;

    }

    return JSON.parse(
      result.value
    ) as ScannerPairing;

  }

  async clear() {

    await Preferences.remove({

      key: KEY,

    });

  }

}