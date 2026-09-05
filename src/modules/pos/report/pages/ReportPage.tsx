"use client";

import { useState } from "react";

import ReportCard from "../components/ReportCard";

import { formatCurrency } from "@/shared/utils/currency";

export default function ReportPage() {
  const now = new Date();

  const [selectedMonth, setSelectedMonth] =
    useState(
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`
    );

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            Laporan Keuangan
          </h1>

          <p className="text-sm text-slate-500">
            Ringkasan keuangan berdasarkan
            bulan yang dipilih.
          </p>
        </div>

      </div>


      {/* FILTER */}

      <div className="rounded-xl border bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">

          <div className="w-full sm:w-auto">

            <label
              htmlFor="report-month"
              className="mb-1 block text-sm font-medium"
            >
              Pilih Bulan
            </label>

            <input
              id="report-month"
              type="month"
              value={selectedMonth}
              onChange={(event) =>
                setSelectedMonth(
                  event.target.value
                )
              }
              className="h-10 w-full rounded-md border px-3 text-sm sm:w-48"
            />

          </div>

          <button
            type="button"
            className="h-10 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            Muat Laporan
          </button>

          <button
            type="button"
            className="h-10 rounded-md bg-slate-600 px-4 text-sm font-medium text-white hover:bg-slate-700"
          >
            Export Excel
          </button>

        </div>

      </div>


      {/* GLOBAL */}

      <section>

        <h2 className="mb-3 text-lg font-semibold">
          Ringkasan Global
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

          <ReportCard
            label="Total Penjualan (global)"
            value={formatCurrency(0)}
          />

          <ReportCard
            label="Total Pemasukan Lain (global)"
            value={formatCurrency(0)}
          />

          <ReportCard
            label="Total Pengeluaran (global)"
            value={formatCurrency(0)}
          />

          <ReportCard
            label="Sisa Hutang Belum Dibayar"
            value={formatCurrency(0)}
          />

          <ReportCard
            label="Saldo Bersih (global)"
            value={formatCurrency(0)}
          />

        </div>

      </section>


      {/* BULAN */}

      <section>

        <h2 className="mb-3 text-lg font-semibold">
          Laporan Bulan{" "}
          {selectedMonth}
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <ReportCard
            label="Penjualan (bulan ini)"
            value={formatCurrency(0)}
          />

          <ReportCard
            label="Pemasukan Lain (bulan ini)"
            value={formatCurrency(0)}
          />

          <ReportCard
            label="Pengeluaran (bulan ini)"
            value={formatCurrency(0)}
          />

          <ReportCard
            label="Hutang Baru (bulan ini)"
            value={formatCurrency(0)}
          />

        </div>

      </section>


      {/* DETAIL BULAN */}

      <section>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

          <ReportCard
            label="Pembayaran Hutang (bulan ini)"
            value={formatCurrency(0)}
          />

          <ReportCard
            label="Sisa Hutang (akhir bulan)"
            value={formatCurrency(0)}
          />

          <ReportCard
            label="Saldo Bersih (bulan ini, dikurangi sisa hutang)"
            value={formatCurrency(0)}
          />

        </div>

      </section>

    </div>
  );
}