"use client";

import { useEffect, useMemo, useState } from "react";

import { Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import PageHeader from "@/modules/pos/shared/components/PageHeader";

import ProductToolbar from "@/modules/pos/product/components/ProductToolbar";
import ProductCatalogGrid from "@/modules/pos/product/components/ProductCatalogGrid";
import AddProductToCartDialog from "@/modules/pos/product/components/AddProductToCartDialog";
import ProductCartDialog from "@/modules/pos/product/components/ProductCartDialog";
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
import type { CartItem } from "@/modules/pos/transaction/types/transaction";
import { ProductVariant } from "@/modules/pos/product/types/product";

export default function ProductPage() {
    const router = useRouter();
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
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartProduct, setCartProduct] = useState<Product>();

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

    function addToCart(product: Product, variant: ProductVariant, quantity: number) {
        setCartItems((current) => {
            const existing = current.find((item) => item.variantId === variant.variantId);
            if (existing) {
                return current.map((item) => item.variantId === variant.variantId
                    ? { ...item, qty: item.qty + quantity, subtotal: (item.qty + quantity) * item.price }
                    : item);
            }
            return [...current, {
                productId: product.productId,
                variantId: variant.variantId,
                productName: product.name,
                hsCode: product.hsCode ?? "",
                variantName: variant.name,
                barcode: variant.barcode,
                price: variant.price,
                qty: quantity,
                subtotal: variant.price * quantity,
            }];
        });
    }

    function continueToTransaction() {
        if (!cartItems.length) return;
        sessionStorage.setItem("pos-product-catalog-cart", JSON.stringify(cartItems));
        router.push("/pos/transactions");
    }

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
                    description="Jelajahi produk, pilih jumlah, dan lanjutkan ke transaksi"
                    actions={<Button variant="outline" onClick={() => setCartOpen(true)}><ShoppingCart className="mr-2 h-4 w-4" />Keranjang ({cartItems.reduce((sum, item) => sum + item.qty, 0)})</Button>}
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

                <ProductCatalogGrid
                    products={filteredProducts}
                    onAdd={(product) => setCartProduct(product)}
                    onEdit={(product) => {
                        setSelectedProduct(product);
                        setDialogOpen(true);
                    }}
                    onDelete={(product) => {
    setDeleteProduct(product);
    setDeleteOpen(true);
}}
                />

                <AddProductToCartDialog
                    open={Boolean(cartProduct)}
                    product={cartProduct}
                    onOpenChange={(open) => { if (!open) setCartProduct(undefined); }}
                    onAdd={addToCart}
                />

                <ProductCartDialog
                    open={cartOpen}
                    onOpenChange={setCartOpen}
                    items={cartItems}
                    onQuantityChange={(variantId, quantity) => setCartItems((current) => current.map((item) => item.variantId === variantId ? { ...item, qty: Math.max(0, Math.floor(quantity)), subtotal: Math.max(0, Math.floor(quantity)) * item.price } : item).filter((item) => item.qty > 0))}
                    onRemove={(variantId) => setCartItems((current) => current.filter((item) => item.variantId !== variantId))}
                    onContinue={continueToTransaction}
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
