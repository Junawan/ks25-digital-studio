import * as XLSX from "xlsx";
import { ProductImportResult, ProductImportRow } from "../types/ProductImport";


export class ProductExcelImporter {
  static async parse(
    file: File
  ): Promise<ProductImportResult> {
    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer);

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const json =
      XLSX.utils.sheet_to_json<any>(sheet);

    const rows: ProductImportRow[] = [];

    const errors: string[] = [];

    json.forEach((item, index) => {
      const productName =
        String(item["Nama Produk"] ?? "").trim();

      const variantName =
        String(item["Nama Varian"] ?? "").trim();

      const barcode =
        String(item["Barcode"] ?? "").trim();

      const price =
        Number(item["Harga Jual"] ?? 0);

      const stock =
        Number(item["Stok"] ?? 0);

      const active =
        String(item["Status"] ?? "Aktif")
          .toLowerCase() === "aktif";

      if (!productName) {
        errors.push(
          `Baris ${index + 2}: Nama Produk kosong`
        );

        return;
      }

      if (!variantName) {
        errors.push(
          `Baris ${index + 2}: Nama Varian kosong`
        );

        return;
      }

      if (price <= 0) {
        errors.push(
          `Baris ${index + 2}: Harga Jual tidak valid`
        );

        return;
      }

      if (stock < 0) {
        errors.push(
          `Baris ${index + 2}: Stok tidak valid`
        );

        return;
      }

      rows.push({
        productName,
        variantName,
        barcode,
        price,
        stock,
        active,
      });
    });

    return {
      rows,
      errors,
    };
  }
}