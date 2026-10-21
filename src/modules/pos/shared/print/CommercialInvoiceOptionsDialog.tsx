"use client";

import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";
import type { CommercialInvoiceDetails } from "./printInvoice";
import type { PosSettings } from "@/modules/pos/settings/types/PosSettings";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  settings: PosSettings | null;
  onSelect: (type: "domestic" | "commercial", details?: CommercialInvoiceDetails) => void;
}

const incoterms = ["EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "FOB", "CFR", "CIF"];

export default function CommercialInvoiceOptionsDialog({ open, onOpenChange, transaction, settings, onSelect }: Props) {
  const [sellerName, setSellerName] = useState<string | null>(null);
  const [sellerAddress, setSellerAddress] = useState<string | null>(null);
  const [sellerPhone, setSellerPhone] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState<string | null>(null);
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerPhone, setBuyerPhone] = useState<string | null>(null);
  const [originCountry, setOriginCountry] = useState("Indonesia");
  const [destinationCountry, setDestinationCountry] = useState("Malaysia");
  const [currency, setCurrency] = useState("IDR");
  const [exchangeRate, setExchangeRate] = useState("");
  const [incoterm, setIncoterm] = useState("");
  const [marksAndNumbers, setMarksAndNumbers] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

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
      setCurrency("IDR");
      setExchangeRate("");
      setIncoterm("");
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

  const hasRequiredExportDetails = Boolean(
    sellerNameValue.trim() && sellerAddressValue.trim() && buyerNameValue.trim() && originCountry.trim() && destinationCountry.trim() && incoterm &&
    (currency === "IDR" || (Number(exchangeRate) > 0 && Number.isFinite(Number(exchangeRate))))
  );

  function printCommercialInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasRequiredExportDetails) return;
    const formData = new FormData(event.currentTarget);
    const hsCodes = transaction?.items.map((_, index) => String(formData.get(`hsCode-${index}`) ?? "").trim()) ?? [];
    const packageCount = Number(formData.get("packageCount"));
    const packageType = String(formData.get("packageType") ?? "").trim();
    const netWeightKg = Number(formData.get("netWeightKg"));
    const grossWeightKg = Number(formData.get("grossWeightKg"));
    const lengthCm = Number(formData.get("lengthCm"));
    const widthCm = Number(formData.get("widthCm"));
    const heightCm = Number(formData.get("heightCm"));
    if (!transaction || hsCodes.some((code) => !code) || !Number.isInteger(packageCount) || packageCount < 1 ||
      !packageType || !Number.isFinite(netWeightKg) || netWeightKg < 0 ||
      !Number.isFinite(grossWeightKg) || grossWeightKg < netWeightKg ||
      !Number.isFinite(lengthCm) || lengthCm <= 0 || !Number.isFinite(widthCm) || widthCm <= 0 ||
      !Number.isFinite(heightCm) || heightCm <= 0) return;
    onSelect("commercial", {
      sellerName: sellerNameValue.trim(),
      sellerAddress: sellerAddressValue.trim(),
      sellerPhone: sellerPhoneValue.trim(),
      buyerName: buyerNameValue.trim(),
      buyerAddress: buyerAddress.trim(),
      buyerPhone: buyerPhoneValue.trim(),
      originCountry: originCountry.trim(),
      destinationCountry: destinationCountry.trim(),
      currency,
      idrPerCurrency: currency === "IDR" ? 1 : Number(exchangeRate),
      incoterm,
      hsCodes,
      packing: { marksAndNumbers: marksAndNumbers.trim(), packageCount, packageType, netWeightKg, grossWeightKg, lengthCm, widthCm, heightCm },
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pilih jenis invoice</DialogTitle>
          <DialogDescription>Invoice domestik tetap menggunakan desain dan isi yang sekarang. Opsi ekspor mencetak Commercial Invoice dan Packing List dalam satu proses.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" onClick={() => { onSelect("domestic"); handleOpenChange(false); }}>Invoice Domestik</Button>
          <Button type="button" variant="outline" onClick={() => document.getElementById("commercial-invoice-details")?.scrollIntoView({ behavior: "smooth" })}>Commercial Invoice + Packing List (Ekspor)</Button>
        </div>
        <form ref={formRef} onSubmit={printCommercialInvoice}>
        <section id="commercial-invoice-details" className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Detail Commercial Invoice</h3>
          <p className="text-xs text-muted-foreground">HS code dan Incoterms perlu dikonfirmasi untuk barang dan pengiriman Anda. Tidak ada kode atau biaya ekspor yang diisi otomatis.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">Nama pengirim / Exporter<Input required value={sellerNameValue} onChange={(e) => setSellerName(e.target.value)} placeholder="Nama pemilik dari info pembayaran POS" /></label>
            <label className="space-y-1">Telepon pengirim<Input type="tel" value={sellerPhoneValue} onChange={(e) => setSellerPhone(e.target.value)} placeholder="Nomor telepon pengirim" /></label>
            <label className="space-y-1 sm:col-span-2">Alamat pengirim / Exporter<Input required value={sellerAddressValue} onChange={(e) => setSellerAddress(e.target.value)} placeholder="Alamat dari pengaturan POS" /></label>
            <label className="space-y-1">Nama penerima / Consignee<Input required value={buyerNameValue} onChange={(e) => setBuyerName(e.target.value)} placeholder="Diisi dari nama pelanggan transaksi atau masukkan manual" /></label>
            <label className="space-y-1">Telepon penerima<Input type="tel" value={buyerPhoneValue} onChange={(e) => setBuyerPhone(e.target.value)} placeholder="Diisi dari nomor pelanggan atau masukkan manual" /></label>
            <label className="space-y-1">Alamat buyer<Input value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} placeholder="Alamat buyer (opsional)" /></label>
            <label className="space-y-1">Country of Origin<Input value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} /></label>
            <label className="space-y-1">Country of Destination<Input value={destinationCountry} onChange={(e) => setDestinationCountry(e.target.value)} /></label>
            <label className="space-y-1">Currency<select className="h-9 w-full rounded-md border bg-background px-3" value={currency} onChange={(e) => setCurrency(e.target.value)}><option value="IDR">IDR</option><option value="MYR">MYR</option><option value="USD">USD</option></select></label>
            <label className="space-y-1">Incoterms<select className="h-9 w-full rounded-md border bg-background px-3" value={incoterm} onChange={(e) => setIncoterm(e.target.value)}><option value="">Pilih Incoterms</option>{incoterms.map((term) => <option key={term} value={term}>{term}</option>)}</select></label>
            {currency !== "IDR" && <label className="space-y-1 sm:col-span-2">Kurs IDR per 1 {currency}<Input type="number" min="0" step="any" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} placeholder="Masukkan kurs yang disepakati" /></label>}
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">HS code per produk</h4>
            {transaction?.items.map((item, index) => <label key={`${item.productId}-${item.variantId}-${index}`} className="grid gap-2 text-sm sm:grid-cols-[1fr_12rem] sm:items-center"><span>{item.productName}{item.variantName ? ` — ${item.variantName}` : ""}</span><Input name={`hsCode-${index}`} defaultValue={item.hsCode ?? ""} required placeholder="Masukkan HS code terverifikasi" /></label>)}
          </div>
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium">Data Packing List untuk seluruh kiriman</h4>
            <p className="text-xs text-muted-foreground">Masukkan berat total seluruh kiriman dan dimensi satu koli. Total CBM dihitung dari CBM per koli dikali jumlah koli.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">Jumlah koli<Input name="packageCount" type="number" min="1" step="1" required placeholder="3" /></label>
              <label className="space-y-1">Jenis kemasan<Input name="packageType" required placeholder="Kardus dengan palet kayu di bagian luar" /></label>
              <label className="space-y-1">Net weight total (kg)<Input name="netWeightKg" type="number" min="0" step="0.001" required placeholder="Berat bersih seluruh barang" /></label>
              <label className="space-y-1">Gross weight total (kg)<Input name="grossWeightKg" type="number" min="0" step="0.001" required placeholder="Termasuk kardus dan palet" /></label>
              <label className="space-y-1">Panjang per koli (cm)<Input name="lengthCm" type="number" min="0.01" step="any" required placeholder="100" /></label>
              <label className="space-y-1">Lebar per koli (cm)<Input name="widthCm" type="number" min="0.01" step="any" required placeholder="100" /></label>
              <label className="space-y-1">Tinggi per koli (cm)<Input name="heightCm" type="number" min="0.01" step="any" required placeholder="100" /></label>
              <label className="space-y-1">Marks &amp; Numbers<Input value={marksAndNumbers} onChange={(e) => setMarksAndNumbers(e.target.value)} placeholder="Opsional" /></label>
            </div>
          </div>
        </section>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Batal</Button>
          <Button type="submit" disabled={!transaction || !hasRequiredExportDetails}>Cetak Invoice + Packing List</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
