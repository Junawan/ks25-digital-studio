"use client";

import { PrintPaper } from "../types/print";

interface PrintOptions {
  paper: PrintPaper;

  title?: string;
}

class PrintService {
  async print({
    paper,
    title,
  }: PrintOptions): Promise<void> {
    const content =
      document.getElementById(
        `print-${paper}`
      );

    if (!content) {
      throw new Error(
        "Area print tidak ditemukan."
      );
    }

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=700"
      );

    if (!printWindow) {
      throw new Error(
        "Gagal membuka jendela print."
      );
    }

    printWindow.document.write(`
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />

<title>${title ?? "Print"}</title>

<style>

html,
body{
    margin:0;
    padding:0;
    background:white;
    font-family:
    Arial,
    Helvetica,
    sans-serif;
}

@page{
    margin:10mm;
}

@media print{

body{
    margin:0;
}

}

</style>

</head>

<body>

${content.innerHTML}

</body>

</html>
`);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();

      printWindow.close();
    }, 300);
  }
}

export const printService =
  new PrintService();