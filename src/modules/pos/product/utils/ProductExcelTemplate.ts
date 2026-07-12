import * as XLSX from "xlsx";

export class ProductExcelTemplate {
  static download() {
    const rows = [
      {
        "Nama Produk": "Aqua",
        "Nama Varian": "600 ml",
        Barcode: "8991234567890",
        "Harga Jual": 3500,
        Stok: 20,
        Status: "Aktif",
      },
      {
        "Nama Produk": "Aqua",
        "Nama Varian": "1500 ml",
        Barcode: "8991234567891",
        "Harga Jual": 7000,
        Stok: 10,
        Status: "Aktif",
      },
      {
        "Nama Produk": "Brownies",
        "Nama Varian": "Original",
        Barcode: "",
        "Harga Jual": 25000,
        Stok: 8,
        Status: "Aktif",
      },
    ];

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Produk"
    );

    XLSX.writeFile(
      workbook,
      "Template-Import-Produk.xlsx"
    );
  }
}