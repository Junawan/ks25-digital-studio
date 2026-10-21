"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  History,
  Search,
} from "lucide-react";

import { toast } from "sonner";

import PageHeader from "@/modules/pos/shared/components/PageHeader";

import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";

import { Button } from "@/shared/components/ui/button";

import { Input } from "@/shared/components/ui/input";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import {
  getPosSettingsUseCase,
} from "@/modules/pos/settings/di";

import TransactionHistoryCard
  from "../components/TransactionHistoryCard";

import { useTransactions }
  from "../hooks/useTransactions";

  import SettlementDialog
  from "../components/SettlementDialog";

import {
  PaymentMethod,
  Transaction,
} from "../types/transaction";
import { printReceipt } from "../../shared/print/printerReceipt";
import { printInvoice } from "../../shared/print/printInvoice";
import { transactionDI } from "../di/transaction";
import CommercialInvoiceOptionsDialog from "../../shared/print/CommercialInvoiceOptionsDialog";
import type { CommercialInvoiceDetails } from "../../shared/print/printInvoice";
import PackingListOptionsDialog from "../../shared/print/PackingListOptionsDialog";
import { printPackingList } from "../../shared/print/printPackingList";
import type { PackingListDetails } from "../../shared/print/printPackingList";
import { resolveTransactionHsCodes } from "../../shared/print/resolveTransactionHsCodes";

export default function TransactionHistoryPage() {

  const { workspace } =
    useWorkspace();

  const {
    transactions,
    loading,
    error,
    reload,
    remove,
  } = useTransactions();

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    getTodayDateKey()
  );
  const [dateMode, setDateMode] = useState<"day" | "range" | "month">("day");
  const [dateFrom, setDateFrom] = useState(getTodayDateKey());
  const [dateTo, setDateTo] = useState(getTodayDateKey());
  const [selectedMonth, setSelectedMonth] = useState(getTodayDateKey().slice(0, 7));

  const [
    search,
    setSearch,
  ] = useState("");

  const [
  statusFilter,
  setStatusFilter,
] = useState<
  "all" | "paid" | "unpaid" | "cancelled"
>("all");

  const [
    settings,
    setSettings,
  ] = useState<
    Awaited<
      ReturnType<
        typeof getPosSettingsUseCase.execute
      >
    >
  >(null);

  const [
    printingId,
    setPrintingId,
  ] = useState<string | null>(null);

  const [invoiceTransaction, setInvoiceTransaction] = useState<Transaction | null>(null);
  const [packingListTransaction, setPackingListTransaction] = useState<Transaction | null>(null);

  const [
  settlementOpen,
  setSettlementOpen,
] = useState(false);

const [
  selectedTransaction,
  setSelectedTransaction,
] =
  useState<Transaction | null>(
    null
  );

const [
  settlementLoading,
  setSettlementLoading,
] = useState(false);

  /*
   * Load POS Settings
   */
  useEffect(() => {

    const companyId =
      workspace?.company.id;

    if (!companyId) {
      return;
    }

    async function loadSettings() {

      try {

        const data =
          await getPosSettingsUseCase.execute(
            companyId!
          );

        setSettings(data);

      } catch (error) {

        console.error(
          "Gagal memuat POS settings:",
          error
        );

      }

    }

    void loadSettings();

  }, [
    workspace?.company.id,
  ]);

  /*
   * Filter transaksi:
   *
   * 1. tanggal
   * 2. invoice
   * 3. nama produk
   * 4. nama variant
   */
  const filteredTransactions =
  useMemo(() => {

    const keyword =
      search
        .trim()
        .toLowerCase();

    return transactions.filter(
      (transaction) => {

        const transactionDate =
          getDateKey(
            transaction.createdAt
          );

        /*
         * Filter tanggal
         */
        const dateMatches = dateMode === "day"
          ? transactionDate === selectedDate
          : dateMode === "range"
            ? transactionDate >= dateFrom && transactionDate <= dateTo
            : transactionDate.startsWith(selectedMonth);
        if (!dateMatches) {
          return false;
        }

        /*
         * Filter status
         */
        if (
          statusFilter !== "all" &&
          transaction.status !==
            statusFilter
        ) {
          return false;
        }

        /*
         * Tidak ada pencarian
         */
        if (!keyword) {
          return true;
        }

        /*
         * Cari invoice
         */
        const invoiceMatch =
          transaction.invoiceNumber
            ?.toLowerCase()
            .includes(keyword);

        /*
         * Cari nama produk / variant
         */
        const productMatch =
          transaction.items.some(
            (item) =>
              item.productName
                ?.toLowerCase()
                .includes(keyword) ||
              item.variantName
                ?.toLowerCase()
                .includes(keyword)
          );

        return (
          invoiceMatch ||
          productMatch
        );
      }
    );

  }, [
    transactions,
    dateMode,
    selectedDate,
    dateFrom,
    dateTo,
    selectedMonth,
    search,
    statusFilter,
  ]);

    function handleOpenSettlement(
  transaction: Transaction
) {
  if (
    transaction.status !==
    "unpaid"
  ) {
    toast.error(
      "Transaksi ini sudah lunas."
    );

    return;
  }

  setSelectedTransaction(
    transaction
  );

  setSettlementOpen(true);
}

async function handleSettlement(
  paymentMethod: PaymentMethod,
  paidAmount: number
) {
  if (!selectedTransaction) {
    return;
  }

  try {

    setSettlementLoading(
      true
    );

    await transactionDI
      .settleTransactionUseCase
      .execute({

        transactionId:
          selectedTransaction.transactionId,

        paymentMethod,

        paidAmount,

      });

    toast.success(
      "Transaksi berhasil dilunasi."
    );

    setSettlementOpen(false);

    setSelectedTransaction(
      null
    );

    await reload();

  } catch (error) {

    console.error(error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Gagal melunasi transaksi."
    );

  } finally {

    setSettlementLoading(
      false
    );

  }
}

  /*
   * Cetak struk
   */
  async function handlePrintReceipt(
    transaction: Transaction
  ) {

    if (!workspace?.company) {
      toast.error(
        "Data toko belum tersedia."
      );
      return;
    }

    if (!settings) {
      toast.error(
        "Pengaturan POS belum tersedia."
      );
      return;
    }

    try {

      setPrintingId(
        transaction.transactionId
      );

      await printReceipt({
        company:
          workspace.company,

        settings,

        transaction,
      });

    } catch (error) {

      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mencetak struk."
      );

    } finally {

      setPrintingId(null);

    }

  }

  /*
   * Cetak invoice
   */
  async function printSelectedInvoice(
    transaction: Transaction,
    details?: CommercialInvoiceDetails
  ) {

    if (!workspace?.company) {
      toast.error(
        "Data toko belum tersedia."
      );
      return;
    }

    if (!settings) {
      toast.error(
        "Pengaturan POS belum tersedia."
      );
      return;
    }

    try {

      setPrintingId(
        transaction.transactionId
      );

      await printInvoice({
        company:
          workspace.company,

        settings,

        transaction,
      }, details);

    } catch (error) {

      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mencetak invoice."
      );

    } finally {

      setPrintingId(null);

    }

  }

  async function handlePrintInvoice(transaction: Transaction) {
    try {
      setInvoiceTransaction(await resolveTransactionHsCodes(transaction));
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat HS code produk.");
    }
  }

  async function handlePreparePackingList(transaction: Transaction) {
    try {
      setPackingListTransaction(await resolveTransactionHsCodes(transaction));
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat HS code produk.");
    }
  }

  async function handlePrintPackingList(details: PackingListDetails) {
    const transaction = packingListTransaction;
    const company = workspace?.company;
    if (!transaction || !company) return;
    try {
      setPrintingId(transaction.transactionId);
      await printPackingList({ company, transaction, details });
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Gagal mencetak Packing List.");
    } finally {
      setPrintingId(null);
      setPackingListTransaction(null);
    }
  }

  /*
   * Hapus transaksi
   */
  async function handleDelete(
    transaction: Transaction
  ) {

    const confirmed =
      window.confirm(
        `Hapus transaksi ${transaction.invoiceNumber}?`
      );

    if (!confirmed) {
      return;
    }

    try {

      await remove(
        transaction.transactionId
      );

      toast.success(
        "Transaksi berhasil dihapus."
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghapus transaksi."
      );

    }

  }

  /*
   * Tombol hari ini
   */
  function handleToday() {
    const today = getTodayDateKey();
    setSelectedDate(today);
    setDateFrom(today);
    setDateTo(today);
    setSelectedMonth(today.slice(0, 7));
    setDateMode("day");
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Riwayat Transaksi"
        description="Daftar transaksi penjualan"
      />

      {/* FILTER */}

      <Card>

        <CardContent className="pt-6">

          <div className="grid gap-4 md:grid-cols-[minmax(220px,1fr)_180px_auto]">

            {/* SEARCH */}

            <div className="relative">

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Cari invoice atau nama produk..."
                className="pl-9"
              />

            </div>

            <select aria-label="Jenis filter tanggal" value={dateMode} onChange={(event) => setDateMode(event.target.value as typeof dateMode)} className="h-10 w-full rounded-md border bg-background px-3 text-sm">
              <option value="day">Per tanggal</option><option value="range">Rentang tanggal</option><option value="month">Per bulan</option>
            </select>

            <div className="flex flex-wrap items-center gap-2 md:col-span-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              {dateMode === "day" && <Input aria-label="Pilih tanggal" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="w-auto min-w-40" />}
              {dateMode === "range" && <><Input aria-label="Tanggal mulai" type="date" value={dateFrom} onChange={(event) => { const next = event.target.value; setDateFrom(next); if (dateTo < next) setDateTo(next); else if (dayDifference(next, dateTo) > 30) setDateTo(addDaysKey(next, 30)); }} className="w-auto min-w-40" /><span className="text-sm text-muted-foreground">sampai</span><Input aria-label="Tanggal akhir (maksimal 31 hari)" type="date" value={dateTo} min={dateFrom || undefined} max={addDaysKey(dateFrom, 30)} onChange={(event) => { const next = event.target.value; setDateTo(dayDifference(dateFrom, next) > 30 ? addDaysKey(dateFrom, 30) : next); }} className="w-auto min-w-40" /></>}
              {dateMode === "month" && <Input aria-label="Pilih bulan" type="month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} className="w-auto min-w-40" />}
            </div>

            <select
  value={statusFilter}
  onChange={(event) =>
    setStatusFilter(
      event.target.value as
        | "all"
        | "paid"
        | "unpaid"
        | "cancelled"
    )
  }
  className="
    h-10
    w-full
    rounded-md
    border
    bg-background
    px-3
    text-sm
  "
>
  <option value="all">
    Semua Status
  </option>

  <option value="paid">
    Lunas
  </option>

  <option value="unpaid">
    Belum Lunas
  </option>

  <option value="cancelled">
    Dibatalkan
  </option>
</select>

            {/* HARI INI */}

            <Button
              type="button"
              variant="outline"
              onClick={
                handleToday
              }
            >
              Hari Ini
            </Button>

          </div>

          <div className="mt-4 text-sm text-muted-foreground">

            Menampilkan{" "}
            <span className="font-medium text-foreground">
              {filteredTransactions.length}
            </span>{" "}
            transaksi pada{" "}
            <span className="font-medium text-foreground">
              {dateMode === "day" ? formatSelectedDate(selectedDate) : dateMode === "range" ? `${formatSelectedDate(dateFrom)} – ${formatSelectedDate(dateTo)}` : formatSelectedMonth(selectedMonth)}
            </span>

          </div>

        </CardContent>

      </Card>

      {/* LOADING */}

      {loading && (
        <Card>

          <CardContent className="flex min-h-32 items-center justify-center">

            <p className="text-sm text-muted-foreground">
              Memuat transaksi...
            </p>

          </CardContent>

        </Card>
      )}

      {/* ERROR */}

      {!loading && error && (
        <Card>

          <CardContent className="flex min-h-32 flex-col items-center justify-center gap-3">

            <p className="text-sm text-destructive">
              {error}
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                void reload()
              }
            >
              Coba Lagi
            </Button>

          </CardContent>

        </Card>
      )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        filteredTransactions.length === 0 && (

          <Card>

            <CardContent className="flex min-h-64 flex-col items-center justify-center">

              <History
                className="
                  mb-3
                  h-10
                  w-10
                  text-muted-foreground
                "
              />

              <h3 className="font-semibold">
                Tidak Ada Transaksi
              </h3>

              <p className="mt-1 text-center text-sm text-muted-foreground">

                {search
                  ? "Tidak ada transaksi yang sesuai dengan pencarian."
                : "Tidak ada transaksi pada tanggal atau periode tersebut."}

              </p>

            </CardContent>

          </Card>
        )}

      {/* LIST */}

      {!loading &&
        !error &&
        filteredTransactions.length > 0 && (

          <div className="space-y-4">

            {filteredTransactions.map(
              (transaction) => (

                <TransactionHistoryCard
                  key={
                    transaction.transactionId
                  }

                  transaction={
                    transaction
                  }

                  onPrintReceipt={
                    handlePrintReceipt
                  }

                  onPrintInvoice={
                    handlePrintInvoice
                  }

                  onPrintPackingList={handlePreparePackingList}

                  onDelete={
                    handleDelete
                  }

                  onSettlement={
    handleOpenSettlement
  }

                  printing={
                    printingId ===
                    transaction.transactionId
                  }
                />

              )
            )}

            {selectedTransaction && <SettlementDialog
  key={selectedTransaction.transactionId}
  open={
    settlementOpen
  }

  onOpenChange={
    setSettlementOpen
  }

  transaction={
    selectedTransaction
  }

  onConfirm={
    handleSettlement
  }

  loading={
    settlementLoading
  }
/>}

      <CommercialInvoiceOptionsDialog
        open={invoiceTransaction !== null}
        onOpenChange={(open) => { if (!open) setInvoiceTransaction(null); }}
        transaction={invoiceTransaction}
        settings={settings}
        onSelect={(type, details) => {
          if (!invoiceTransaction) return;
          const transaction = invoiceTransaction;
          setInvoiceTransaction(null);
          void printSelectedInvoice(transaction, type === "commercial" ? details : undefined);
        }}
      />

      <PackingListOptionsDialog
        open={packingListTransaction !== null}
        onOpenChange={(open) => { if (!open) setPackingListTransaction(null); }}
        transaction={packingListTransaction}
        onPrint={(details) => { void handlePrintPackingList(details); }}
      />

          </div>
        )}

    </div>
  );
}

/*
 * YYYY-MM-DD
 */
function getTodayDateKey() {

  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*
 * Firestore Date / JS Date
 */
function getDateKey(
  value: Date | string | number
) {

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*
 * Tampilan tanggal Indonesia
 */
function formatSelectedDate(
  value: string
) {

  if (!value) {
    return "-";
  }

  const [
    year,
    month,
    day,
  ] = value.split("-");

  const date =
    new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

  return date.toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function addDaysKey(value: string, days: number) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dayDifference(start: string, end: string) {
  if (!start || !end) return 0;
  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);
  return Math.round((Date.UTC(endYear, endMonth - 1, endDay) - Date.UTC(startYear, startMonth - 1, startDay)) / 86_400_000);
}

function formatSelectedMonth(value: string) {
  if (!value) return "-";
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}
