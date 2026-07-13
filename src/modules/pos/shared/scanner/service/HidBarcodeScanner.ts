export class HidBarcodeScanner {
  private buffer = "";

  private dispose?: () => void;

  start(
    onDetected: (barcode: string) => void
  ) {
    const listener = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Enter") {
        const barcode =
          this.buffer.trim();

        this.buffer = "";

        if (!barcode) {
          return;
        }

        onDetected(barcode);

        return;
      }

      if (event.key.length !== 1) {
        return;
      }

      this.buffer += event.key;
    };

    window.addEventListener(
      "keydown",
      listener
    );

    this.dispose = () => {
      window.removeEventListener(
        "keydown",
        listener
      );
    };
  }

  stop() {
    this.buffer = "";

    this.dispose?.();

    this.dispose = undefined;
  }
}