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
    const fitInvoicePages = `<script>
      (() => {
        const fitPages = () => {
          document.querySelectorAll('.invoice-page').forEach((page) => {
            page.style.setProperty('box-sizing', 'border-box', 'important');
            page.style.setProperty('width', '794px', 'important');
            page.style.setProperty('height', 'auto', 'important');
            page.style.setProperty('min-height', '0', 'important');
            page.style.setProperty('margin', '0', 'important');
            page.style.setProperty('padding', '0', 'important');
            page.style.setProperty('overflow', 'visible', 'important');
            page.style.setProperty('position', 'relative', 'important');
            const content = page.querySelector('.invoice-content');
            if (!content) return;
            content.style.setProperty('box-sizing', 'border-box', 'important');
            content.style.setProperty('width', '794px', 'important');
            content.style.setProperty('height', 'auto', 'important');
            content.style.setProperty('max-height', 'none', 'important');
            content.style.setProperty('overflow', 'visible', 'important');
            content.style.setProperty('padding', '38px', 'important');
            content.style.setProperty('transform', 'none', 'important');
            content.style.setProperty('margin-left', '0', 'important');
            const naturalWidth = Math.max(content.scrollWidth, 1);
            const naturalHeight = Math.max(content.scrollHeight, 1);
            // Fit the width only. The native PDF page grows to the content height,
            // which keeps every invoice line on one page instead of clipping A4.
            const scale = Math.min(1, 794 / naturalWidth);
            content.style.setProperty('transform-origin', 'top left', 'important');
            content.style.setProperty('transform', 'scale(' + scale + ')', 'important');
            content.style.setProperty('margin-left', ((794 - naturalWidth * scale) / 2) + 'px', 'important');
            page.style.setProperty('height', Math.ceil(naturalHeight * scale + 8) + 'px', 'important');
          });
        };
        if (document.readyState === 'complete') fitPages();
        else window.addEventListener('load', fitPages, { once: true });
      })();
    </script>`;
    const html = `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=794,initial-scale=1"><title>Invoice</title>${styles}<style>@page{size:A4 portrait;margin:0}html,body{width:794px;margin:0;padding:0;background:white}body{color:#000}</style></head><body>${content}${fitInvoicePages}</body></html>`;
    const fileName = `${title.replace(/[\\/:*?"<>|]/g, "-")}.pdf`;
    await PdfDownload.save({ fileName, html });
    toast.success(`PDF tersimpan di Unduhan/KS25: ${fileName}`);
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
