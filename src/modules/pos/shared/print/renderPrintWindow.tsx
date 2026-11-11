"use client";

import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { toast } from "sonner";

const PdfDownload = registerPlugin<{ save(options: { fileName: string; html: string }): Promise<void> }>("PdfDownload");

export async function renderPrintWindow(
  element: React.ReactElement,
  title = "Print"
) {
  if (Capacitor.getPlatform() === "android") {
    const content = renderToStaticMarkup(element);
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((node) => node.outerHTML).join("\n");
    const html = `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Invoice</title>${styles}<style>@page{size:A4 portrait;margin:0}html,body{margin:0;padding:0;background:white}body{color:#000}</style></head><body>${content}</body></html>`;
    const fileName = `${title.replace(/[\\/:*?"<>|]/g, "-")}.pdf`;
    await PdfDownload.save({ fileName, html });
    toast.info("Pilih Simpan sebagai PDF pada dialog cetak Android untuk mengunduh invoice.");
    return;
  }
  const printWindow = window.open(
    "",
    "_blank",
    "width=420,height=800"
  );

  if (!printWindow) {
    throw new Error(
      "Popup diblokir browser."
    );
  }

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>${title}</title>

<style>

html,
body{

margin:0;

padding:0;

background:white;

}

@media print{

body{

margin:0;

}

}

</style>

</head>

<body>

<div id="root"></div>

</body>

</html>
`);

  printWindow.document.close();

  // Salin seluruh stylesheet dari halaman utama
document
  .querySelectorAll(
    'link[rel="stylesheet"], style'
  )
  .forEach((node) => {
    printWindow.document.head.appendChild(
      node.cloneNode(true)
    );
  });

  const rootElement =
    printWindow.document.getElementById(
      "root"
    );

  if (!rootElement) {
    return;
  }

  const root = createRoot(rootElement);

root.render(element);

// Tunggu React selesai render
requestAnimationFrame(() => {
  requestAnimationFrame(() => {

    // tunggu seluruh image selesai
    const images = Array.from(
      printWindow.document.images
    );

    Promise.all(
      images.map(
        (image) =>
          image.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                image.onload = () => resolve();
                image.onerror = () => resolve();
              })
      )
    ).then(() => {
      printWindow.focus();

      printWindow.print();

      // sementara jangan ditutup dulu
      // printWindow.close();
    });

  });
});
}
