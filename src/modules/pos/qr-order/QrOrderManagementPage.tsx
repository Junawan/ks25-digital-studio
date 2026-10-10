"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onSnapshot, query, where, collection, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Clipboard, ExternalLink, QrCode } from "lucide-react";
import { db } from "@/core/firebase";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import PageHeader from "@/modules/pos/shared/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/components/ui/button";
import type { QrOrder } from "./qrOrder.types";
import type { CartItem } from "@/modules/pos/transaction/types/transaction";

export default function QrOrderManagementPage() {
  const { workspace } = useWorkspace();
  const router = useRouter();
  const company = workspace?.company;
  const [pageUrl, setPageUrl] = useState("");
  const [orders, setOrders] = useState<QrOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageUrl(`${window.location.origin}/order/${company?.id ?? ""}`);
  }, [company?.id]);

  useEffect(() => {
    if (!company?.id) return;
    const ordersQuery = query(
      collection(db, "pos_qr_orders"),
      where("companyId", "==", company.id),
    );
    return onSnapshot(ordersQuery, (snapshot) => {
      const nextOrders = snapshot.docs.map((item) => {
        const data = item.data();
        return { ...data, orderId: item.id, createdAt: data.createdAt?.toDate?.() ?? new Date() } as QrOrder;
      });
      nextOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setOrders(nextOrders);
      setLoading(false);
    }, (error) => {
      console.error("Gagal memantau pesanan QR:", error);
      toast.error("Pesanan QR tidak dapat dimuat. Periksa koneksi dan indeks Firestore.");
      setLoading(false);
    });
  }, [company?.id]);

  async function continueToPayment(order: QrOrder) {
    const items: CartItem[] = order.items.map((item) => ({ ...item, hsCode: "" }));
    const payload = { items, customerName: order.customerName, phone: order.phone, orderNumber: order.orderNumber };
    try {
      sessionStorage.setItem("pos-qr-incoming-order", JSON.stringify(payload));
      await updateDoc(doc(db, "pos_qr_orders", order.orderId), { status: "preparing", acceptedAt: serverTimestamp(), updatedAt: serverTimestamp() });
      router.push("/pos/transactions");
    } catch (error) {
      sessionStorage.removeItem("pos-qr-incoming-order");
      console.error("Gagal menerima pesanan QR:", error);
      toast.error("Pesanan belum dapat diteruskan ke kasir.");
    }
  }

  async function completeOrder(order: QrOrder) {
    try {
      await updateDoc(doc(db, "pos_qr_orders", order.orderId), { status: "completed", completedAt: serverTimestamp(), updatedAt: serverTimestamp() });
      toast.success(`Pesanan ${order.orderNumber} selesai.`);
    } catch (error) {
      console.error("Gagal menyelesaikan pesanan QR:", error);
      toast.error("Status pesanan belum dapat diperbarui.");
    }
  }

  async function cancelOrder(order: QrOrder) {
    try {
      await updateDoc(doc(db, "pos_qr_orders", order.orderId), { status: "cancelled", updatedAt: serverTimestamp() });
      toast.success("Pesanan ditutup.");
    } catch (error) {
      console.error(error);
      toast.error("Pesanan gagal ditutup.");
    }
  }

  if (!company) return null;

  const incomingOrders = orders.filter((order) => order.status === "pending");
  const preparingOrders = orders.filter((order) => order.status === "preparing" || order.status === "accepted");
  const completedOrders = orders.filter((order) => order.status === "completed");

  function renderOrder(order: QrOrder, stage: "incoming" | "preparing" | "completed") {
    return <Card key={order.orderId}>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-semibold">{order.orderNumber}</p><p className="text-sm text-muted-foreground">{order.createdAt.toLocaleString("id-ID")}</p></div><p className="font-semibold">Rp {order.total.toLocaleString("id-ID")}</p></div>
        {(order.customerName || order.phone) && <p className="text-sm">{order.customerName || "Pelanggan"}{order.phone ? ` · ${order.phone}` : ""}</p>}
        <div className="space-y-1 border-y py-3 text-sm">{order.items.map((item) => <div key={`${item.productId}:${item.variantId}`} className="flex justify-between gap-3"><span>{item.productName} — {item.variantName} × {item.qty}</span><span className="shrink-0">Rp {item.subtotal.toLocaleString("id-ID")}</span></div>)}</div>
        {stage === "incoming" && <div className="grid grid-cols-2 gap-2"><Button onClick={() => { void continueToPayment(order); }}>Lanjut pembayaran</Button><Button variant="outline" onClick={() => { void cancelOrder(order); }}>Tutup pesanan</Button></div>}
        {stage === "preparing" && <Button className="w-full" onClick={() => { void completeOrder(order); }}>Tandai selesai</Button>}
        {stage === "completed" && <p className="text-sm font-medium text-green-700 dark:text-green-400">Pesanan selesai</p>}
      </CardContent>
    </Card>;
  }

  function renderOrderSection(title: string, emptyText: string, sectionOrders: QrOrder[], stage: "incoming" | "preparing" | "completed") {
    return <section className="space-y-3">
      <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium">{sectionOrders.length}</span></div>
      {loading ? <Card className="p-6 text-center text-sm text-muted-foreground">Memuat pesanan...</Card> : sectionOrders.length ? sectionOrders.map((order) => renderOrder(order, stage)) : <Card className="p-6 text-center text-sm text-muted-foreground">{emptyText}</Card>}
    </section>;
  }

  return <div className="space-y-6">
    <PageHeader title="Order by QR" description="Pelanggan scan QR untuk melihat menu dan mengirim pesanan ke kasir." />
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <Card id="qr-menu-print">
        <CardHeader><CardTitle className="flex items-center gap-2"><QrCode className="h-5 w-5" />QR Menu Pelanggan</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="mx-auto flex w-fit rounded-xl border bg-white p-4"><QRCodeSVG value={pageUrl || "/"} size={240} level="H" includeMargin /></div>
          <p className="break-all rounded-lg bg-muted p-3 text-center text-sm">{pageUrl || "Menyiapkan tautan..."}</p>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" onClick={() => { void navigator.clipboard.writeText(pageUrl).then(() => toast.success("Tautan menu disalin.")); }} disabled={!pageUrl}><Clipboard className="mr-2 h-4 w-4" />Salin tautan</Button>
            <Button variant="outline" onClick={() => window.open(pageUrl, "_blank", "noopener,noreferrer")} disabled={!pageUrl}><ExternalLink className="mr-2 h-4 w-4" />Buka menu</Button>
            <Button variant="outline" onClick={() => window.print()} disabled={!pageUrl}>Cetak QR</Button>
          </div>
          <p className="text-xs text-muted-foreground">Cetak atau tampilkan QR ini di meja/kasir. Agar pelanggan dapat mengaksesnya, alamat aplikasi harus dapat dibuka dari internet atau jaringan yang sama.</p>
        </CardContent>
      </Card>

      <section className="space-y-6">
        {renderOrderSection("Pesanan masuk", "Belum ada pesanan baru.", incomingOrders, "incoming")}
        {renderOrderSection("Diproses / disiapkan", "Belum ada pesanan yang sedang disiapkan.", preparingOrders, "preparing")}
        {renderOrderSection("Pesanan selesai", "Belum ada pesanan selesai.", completedOrders, "completed")}
      </section>
    </div>
    <style>{`@media print { body * { visibility: hidden !important; } #qr-menu-print, #qr-menu-print * { visibility: visible !important; } #qr-menu-print { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; border: 0 !important; box-shadow: none !important; } }`}</style>
  </div>;
}
