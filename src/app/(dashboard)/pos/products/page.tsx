"use client";

import { useEffect, useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import PageHeader from "@/modules/pos/shared/components/PageHeader";

import ProductToolbar from "@/modules/pos/product/components/ProductToolbar";
import ProductTable from "@/modules/pos/product/components/ProductTable";
import ProductDialog from "@/modules/pos/product/components/ProductDialog";

import { useProducts } from "@/modules/pos/product/hooks/useProducts";

import { Product } from "@/modules/pos/product/types/product";

import DeleteConfirmDialog from "@/modules/pos/shared/components/DeleteConfirmDialog";
import LoadingSkeleton from "@/modules/pos/shared/components/skeletons/LoadingSkeleton";
import TableSkeleton from "@/modules/pos/shared/components/skeletons/TableSkeleton";
import ProductImportDialog from "@/modules/pos/product/components/import/ProductImportDialog";
import { useProductExport } from "@/modules/pos/product/hooks/useProductExport";
import { scannerDI }
from "@/modules/pos/shared/scanner/di/scanner";

export default function ProductPage() {
    const { workspace, loading: workspaceLoading } = useWorkspace();

const company = workspace?.company;

useEffect(() => {
  if (!company) {
    return;
  }

  scannerDI.scannerService.initialize(
    company.id,
    "kasir-1"
  );
}, [company]);

    const [keyword, setKeyword] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] =
        useState<Product>();

        const [deleteOpen, setDeleteOpen] = useState(false);

const [deleteLoading, setDeleteLoading] = useState(false);

const [deleteProduct, setDeleteProduct] =
    useState<Product>();

    const [importOpen, setImportOpen] =
    useState(false);

const {
  loading,
  products,
  reload,
  remove,
} = useProducts({
  companyId: company?.id ?? "",
});

const {
    loading: exportLoading,
    exportProducts,
} = useProductExport({
    companyId: company?.id ?? "",
});


    const filteredProducts = useMemo(() => {
        if (!keyword.trim()) {
            return products;
        }

        const q = keyword.toLowerCase();

        return products.filter((product) => {
            if (
                product.name
                    .toLowerCase()
                    .includes(q)
            ) {
                return true;
            }

            return product.variants.some(
                (variant) =>
                    variant.name
                        .toLowerCase()
                        .includes(q) ||
                    variant.barcode
                        .toLowerCase()
                        .includes(q)
            );
        });
    }, [keyword, products]);

    if (workspaceLoading || loading) {
    return <TableSkeleton />;
}

    if (!company) {
        return null;
    }

    return (
        <>
            <div className="space-y-6">

                <PageHeader
                    title="Produk"
                    description="Kelola seluruh produk toko"
                />

                <ProductToolbar
                    keyword={keyword}
                    onKeywordChange={setKeyword}
                    onCreate={() => {
                        setSelectedProduct(undefined);
                        setDialogOpen(true);
                    }}
                    onImport={() =>
        setImportOpen(true)}
                    onExport={() => {
    if (!exportLoading) {
        exportProducts();
    }
}}
                />

                <ProductImportDialog
    open={importOpen}
    onOpenChange={setImportOpen}
    companyId={company.id}
    onSuccess={reload}
/>

                <ProductTable
                    products={filteredProducts}
                    onEdit={(product) => {
                        setSelectedProduct(product);
                        setDialogOpen(true);
                    }}
                    onDelete={(product) => {
    setDeleteProduct(product);
    setDeleteOpen(true);
}}
                />

                <ProductDialog
                    open={dialogOpen}
                    onOpenChange={
                        setDialogOpen
                    }
                    companyId={
                        company.id
                    }
                    product={selectedProduct}
                    onSuccess={reload}
                />

                <DeleteConfirmDialog
    open={deleteOpen}
    onOpenChange={setDeleteOpen}
    title="Hapus Produk"
    description={`Produk "${deleteProduct?.name}" akan dihapus secara permanen.`}
    loading={deleteLoading}
    onConfirm={async () => {
        if (!deleteProduct) {
            return;
        }

        setDeleteLoading(true);

        try {
            await remove(
                deleteProduct.productId
            );

            setDeleteOpen(false);

            setDeleteProduct(undefined);

            await reload();
        } finally {
            setDeleteLoading(false);
        }
    }}
/>
            </div>

            {/* Android FAB */}

            <Button
                size="icon"
                className="
                    fixed
                    bottom-20
                    right-5
                    h-14
                    w-14
                    rounded-full
                    shadow-xl
                    lg:hidden
                "
                onClick={() => {
                    setSelectedProduct(undefined);

                    setDialogOpen(true);
                }}
            >
                <Plus className="h-6 w-6" />
            </Button>
        </>
    );
}