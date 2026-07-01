"use client";

import { useState } from "react";

import ProductGrid from "@/modules/live-assistant/product/components/ProductGrid";
import ProductToolbar from "@/modules/live-assistant/product/components/ProductToolbar";

import { useProducts } from "@/modules/live-assistant/product/hooks/useProducts";

import ProductDialog from "@/modules/live-assistant/product/components/ProductDialog";
import ImportProductDialog from "@/modules/live-assistant/product/components/ImportProductDialog";
import { Product } from "@/modules/live-assistant/product/product.types";

export default function ProductsPage() {
  const { products, loading, refresh } = useProducts();

  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedProduct, setSelectedProduct] =
  useState<Product | undefined>();

  const [importOpen, setImportOpen] =
  useState(false);

  if (loading) {
    return (
      <div className="p-6">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Products
        </h1>

        <p className="text-muted-foreground">
          Kelola produk untuk Live Assistant.
        </p>
      </div>

      <ProductToolbar
  search={search}
  onSearchChange={setSearch}
  onCreate={() => setOpenDialog(true)}
  onImport={() => setImportOpen(true)}
  onExport={() => {}}
  onGenerateAI={() => {}}
/>

      <ProductGrid
  products={products.filter((product) =>
    product.title
      .toLowerCase()
      .includes(search.toLowerCase())
  )}
  onEdit={(product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  }}
/>

      <ProductDialog
  open={openDialog}
  onOpenChange={(open) => {
    setOpenDialog(open);

    if (!open) {
      setSelectedProduct(undefined);
    }
  }}
  product={selectedProduct}
  onSuccess={() => {
    refresh();
    setSelectedProduct(undefined);
  }}
/>

<ImportProductDialog
  open={importOpen}
  onOpenChange={setImportOpen}
/>
    </div>
  );
}