"use client";

import { createRoot } from "react-dom/client";

export async function renderPrintWindow(
  element: React.ReactElement,
  title = "Print"
) {
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

  const rootElement =
    printWindow.document.getElementById(
      "root"
    );

  if (!rootElement) {
    return;
  }

  const root =
    createRoot(rootElement);

  root.render(element);

  setTimeout(() => {

    printWindow.focus();

    printWindow.print();

    printWindow.close();

  }, 300);
}