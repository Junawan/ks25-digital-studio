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

import { Transaction }
  from "../types/transaction";
import { printReceipt } from "../../shared/print/printerReceipt";
import { printInvoice } from "../../shared/print/printInvoice";

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

  const [
    search,
    setSearch,
  ] = useState("");

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
          if (
            transactionDate !==
            selectedDate
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
           *
           * Contoh:
           * KS25-260815-143305
           *
           * user bisa mengetik:
           * 4305
           * 1433
           * KS25
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
      selectedDate,
      search,
    ]);

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
  async function handlePrintInvoice(
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

      await printInvoice({
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
          : "Gagal mencetak invoice."
      );

    } finally {

      setPrintingId(null);

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

    setSelectedDate(
      getTodayDateKey()
    );

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

          <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">

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

            {/* TANGGAL */}

            <div className="relative">

              <CalendarDays
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
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(
                    event.target.value
                  )
                }
                className="pl-9"
              />

            </div>

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
              {formatSelectedDate(
                selectedDate
              )}
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
                  : "Tidak ada transaksi pada tanggal tersebut."}

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

                  onDelete={
                    handleDelete
                  }

                  printing={
                    printingId ===
                    transaction.transactionId
                  }
                />

              )
            )}

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