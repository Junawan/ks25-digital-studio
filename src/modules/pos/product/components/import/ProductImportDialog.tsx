"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/components/ui/button";

import ProgressOverlay from "@/modules/pos/shared/components/ProgressOverlay";
import ImportSummaryDialog from "@/modules/pos/shared/components/ImportSummaryDialog";

import { ProductExcelTemplate } from "../../utils/ProductExcelTemplate";
import { useProductImport } from "../../hooks/useProductImport";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  companyId: string;

  onSuccess?: () => void;
}

export default function ProductImportDialog({
  open,
  onOpenChange,
  companyId,
  onSuccess,
}: Props) {
  const {
    loading,
    file,
    validRows,
    errors,

    progressOpen,
    current,
    total,
    currentProduct,

    summary,
    summaryOpen,
    setSummaryOpen,

    selectFile,
    importFile,
    reset,
  } = useProductImport({
    companyId,
    onSuccess,
  });

  async function handleImport() {
    await importFile();
  }

  function handleClose(open: boolean) {
    if (!open) {
      reset();
    }

    onOpenChange(open);
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={handleClose}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Import Produk
            </DialogTitle>

            <DialogDescription>
              Upload file Excel sesuai template.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                ProductExcelTemplate.download()
              }
            >
              Download Template Excel
            </Button>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (file) {
                  selectFile(file);
                }
              }}
            />

            {file && (
              <div className="rounded-lg border p-4 text-sm space-y-2">

                <div className="flex justify-between">
                  <span>File</span>

                  <span className="font-medium">
                    {file.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Data Valid</span>

                  <span className="font-medium">
                    {validRows}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Error</span>

                  <span className="font-medium text-destructive">
                    {errors.length}
                  </span>
                </div>

              </div>
            )}

            {errors.length > 0 && (
              <div className="max-h-40 overflow-auto rounded-lg border bg-muted p-3 text-sm">

                {errors.map((error, index) => (
                  <div key={index}>
                    • {error}
                  </div>
                ))}

              </div>
            )}

            <Button
              className="w-full"
              disabled={
                loading ||
                !file ||
                validRows === 0
              }
              onClick={handleImport}
            >
              {loading
                ? "Mengimpor..."
                : `Import ${validRows} Produk`}
            </Button>

          </div>
        </DialogContent>
      </Dialog>

      <ProgressOverlay
        open={progressOpen}
        title="Mengimpor Produk"
        current={current}
        total={total}
        description={currentProduct}
      />

      <ImportSummaryDialog
        open={summaryOpen}
        onOpenChange={(open) => {
          setSummaryOpen(open);

          if (!open) {
            reset();

            onOpenChange(false);
          }
        }}
        total={summary.total}
        success={summary.success}
        skipped={summary.skipped}
        failed={summary.failed}
        errors={summary.errors}
      />
    </>
  );
}