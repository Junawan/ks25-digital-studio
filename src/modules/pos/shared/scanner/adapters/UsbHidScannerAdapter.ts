export class UsbHidScannerAdapter {

  private buffer = "";

  private listener?: (
    event: KeyboardEvent
  ) => void;

  start(
    onBarcode: (
      barcode: string
    ) => void
  ) {

    this.stop();

    this.buffer = "";

    this.listener = (
      event: KeyboardEvent
    ) => {

      // Abaikan kombinasi tombol
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      ) {
        return;
      }

      // Scanner selesai mengirim barcode
      if (event.key === "Enter") {

        const barcode =
          this.buffer.trim();

        this.buffer = "";

        if (barcode.length > 0) {
          onBarcode(barcode);
        }

        return;
      }

      // Karakter barcode
      if (event.key.length === 1) {
        this.buffer += event.key;
      }

    };

    window.addEventListener(
      "keydown",
      this.listener
    );

  }

  stop() {

    if (!this.listener) {
      return;
    }

    window.removeEventListener(
      "keydown",
      this.listener
    );

    this.listener = undefined;

    this.buffer = "";

  }

}