"use client";

import { useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";
import type { PackingListDetails } from "./printPackingList";
import type { PosSettings } from "@/modules/pos/settings/types/PosSettings";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  settings: PosSettings | null;
  onPrint: (details: PackingListDetails) => void;
}

export default function PackingListOptionsDialog({ open, onOpenChange, transaction, settings, onPrint }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [sellerName, setSellerName] = useState<string | null>(null);
  const [sellerAddress, setSellerAddress] = useState<string | null>(null);
  const [sellerPhone, setSellerPhone] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState<string | null>(null);
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerPhone, setBuyerPhone] = useState<string | null>(null);
  const [originCountry, setOriginCountry] = useState("Indonesia");
  const [destinationCountry, setDestinationCountry] = useState("Malaysia");
  const [marksAndNumbers, setMarksAndNumbers] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen && !open) {
      setSellerName(null);
      setSellerAddress(null);
      setSellerPhone(null);
      setBuyerName(null);
      setBuyerAddress("");
      setBuyerPhone(null);
      setOriginCountry("Indonesia");
      setDestinationCountry("Malaysia");
      setMarksAndNumbers("");
      formRef.current?.reset();
    }
    onOpenChange(nextOpen);
  }

  const sellerNameValue = sellerName ?? settings?.accountHolder ?? "";
  const sellerAddressValue = sellerAddress ?? settings?.address ?? "";
  const sellerPhoneValue = sellerPhone ?? settings?.phone ?? "";
  const buyerNameValue = buyerName ?? transaction?.customerName ?? "";
  const buyerPhoneValue = buyerPhone ?? transaction?.customerPhone ?? "";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!transaction) return;
    const formData = new FormData(event.currentTarget);
    const packageCount = Number(formData.get("packageCount"));
    const packageType = String(formData.get("packageType") ?? "").trim();
    const netWeightKg = Number(formData.get("netWeightKg"));
    const grossWeightKg = Number(formData.get("grossWeightKg"));
    const lengthCm = Number(formData.get("lengthCm"));
    const widthCm = Number(formData.get("widthCm"));
    const heightCm = Number(formData.get("heightCm"));

    if (!Number.isInteger(packageCount) || packageCount < 1 || !packageType ||
      !Number.isFinite(netWeightKg) || netWeightKg < 0 ||
      !Number.isFinite(grossWeightKg) || grossWeightKg < netWeightKg ||
      !Number.isFinite(lengthCm) || lengthCm <= 0 ||
      !Number.isFinite(widthCm) || widthCm <= 0 ||
      !Number.isFinite(heightCm) || heightCm <= 0) return;

    onPrint({
      sellerName: sellerNameValue.trim(),
      sellerAddress: sellerAddressValue.trim(),
      sellerPhone: sellerPhoneValue.trim(),
      buyerName: buyerNameValue.trim(),
      buyerAddress: buyerAddress.trim(),
      buyerPhone: buyerPhoneValue.trim(),
      originCountry: originCountry.trim(),
      destinationCountry: destinationCountry.trim(),
      marksAndNumbers: marksAndNumbers.trim(),
      packageCount,
      packageType,
      netWeightKg,
      grossWeightKg,
      lengthCm,
      widthCm,
      heightCm,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Siapkan Packing List Ekspor</DialogTitle>
          <DialogDescription>Masukkan jumlah koli, berat total seluruh kiriman, dan dimensi per koli. HS code diambil dari data produk bila tersedia.</DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">Nama pengirim / Exporter<Input required value={sellerNameValue} onChange={(event) => setSellerName(event.currentTarget.value)} placeholder="Nama pemilik dari info pembayaran POS" /></label>
              <label className="space-y-1">Telepon pengirim<Input type="tel" value={sellerPhoneValue} onChange={(event) => setSellerPhone(event.currentTarget.value)} placeholder="Nomor telepon pengirim" /></label>
              <label className="space-y-1 sm:col-span-2">Alamat pengirim / Exporter<Input required value={sellerAddressValue} onChange={(event) => setSellerAddress(event.currentTarget.value)} placeholder="Alamat dari pengaturan POS" /></label>
              <label className="space-y-1">Nama penerima / Consignee<Input required value={buyerNameValue} onChange={(event) => setBuyerName(event.currentTarget.value)} placeholder="Diisi dari nama pelanggan transaksi atau masukkan manual" /></label>
              <label className="space-y-1">Telepon penerima<Input type="tel" value={buyerPhoneValue} onChange={(event) => setBuyerPhone(event.currentTarget.value)} placeholder="Diisi dari nomor pelanggan atau masukkan manual" /></label>
              <label className="space-y-1">Alamat buyer<Input value={buyerAddress} onChange={(event) => setBuyerAddress(event.currentTarget.value)} placeholder="Alamat buyer (opsional)" /></label>
              <label className="space-y-1">Country of Origin<Input required value={originCountry} onChange={(event) => setOriginCountry(event.currentTarget.value)} /></label>
              <label className="space-y-1">Country of Destination<Input required value={destinationCountry} onChange={(event) => setDestinationCountry(event.currentTarget.value)} /></label>
              <label className="space-y-1 sm:col-span-2">Marks &amp; Numbers<Input value={marksAndNumbers} onChange={(event) => setMarksAndNumbers(event.currentTarget.value)} placeholder="Tanda/nomor koli (opsional)" /></label>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">Total kemasan kiriman</h3>
                <p className="text-xs text-muted-foreground">Berat adalah total seluruh kiriman. Dimensi adalah ukuran satu koli; CBM total dihitung dari CBM per koli × jumlah koli. Berat kotor harus sama atau lebih besar dari berat bersih.</p>
              </div>
              <div className="grid gap-3 rounded-lg border p-3 sm:grid-cols-2">
                <label className="space-y-1">Jumlah koli total<Input name="packageCount" type="number" min="1" step="1" required placeholder="Jumlah paket" /></label>
                <label className="space-y-1">Jenis kemasan<Input name="packageType" required placeholder="Karton, peti, pallet, dll." /></label>
                <label className="space-y-1">Net weight total (kg)<Input name="netWeightKg" type="number" min="0" step="0.001" required placeholder="0" /></label>
                <label className="space-y-1">Gross weight total (kg)<Input name="grossWeightKg" type="number" min="0" step="0.001" required placeholder="0" /></label>
                <label className="space-y-1">Panjang per koli (cm)<Input name="lengthCm" type="number" min="0.01" step="any" required placeholder="100" /></label>
                <label className="space-y-1">Lebar per koli (cm)<Input name="widthCm" type="number" min="0.01" step="any" required placeholder="100" /></label>
                <label className="space-y-1">Tinggi per koli (cm)<Input name="heightCm" type="number" min="0.01" step="any" required placeholder="100" /></label>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Barang dalam kiriman</h3>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/30 text-left"><th className="p-2">Produk</th><th className="p-2">HS code</th><th className="p-2 text-right">Qty</th></tr></thead>
                  <tbody>{transaction?.items.map((item, index) => <tr key={`${item.productId}-${item.variantId}-${index}`} className="border-b last:border-0"><td className="p-2">{item.productName}{item.variantName ? ` — ${item.variantName}` : ""}</td><td className="p-2">{item.hsCode || "—"}</td><td className="p-2 text-right">{item.qty}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Batal</Button>
              <Button type="submit" disabled={!transaction}>Cetak Packing List</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
