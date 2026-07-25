export default function InvoiceStyles() {
  return (
    <style jsx global>{`
      @page {
        size: A4 portrait;
        margin: 12mm;
      }

      html,
      body {
        margin: 0;
        padding: 0;
      }

      body {
        background: #f3f4f6;
      }

      .invoice-page {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        background: white;
        color: black;
      }

      @media print {
        html,
        body {
          background: white;
          margin: 0;
          padding: 0;

          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .invoice-page {
          width: 100%;
          min-height: auto;
          margin: 0;
          box-shadow: none;
        }
      }
    `}</style>
  );
}