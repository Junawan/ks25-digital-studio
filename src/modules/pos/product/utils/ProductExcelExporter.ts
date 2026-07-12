import * as XLSX from "xlsx";

import { Product } from "../types/product";

export class ProductExcelExporter {
  static download(products: Product[]) {
    const rows: any[] = [];

    products.forEach((product) => {
      product.variants.forEach((variant) => {
        rows.push({
          "Nama Produk": product.name,
          "Nama Varian": variant.name,
          Barcode: variant.barcode,
          "Harga Jual": variant.price,
          Stok: variant.stock,
          Status: product.active
            ? "Aktif"
            : "Nonaktif",
        });
      });
    });

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
      "Produk.xlsx"
    );
  }
}