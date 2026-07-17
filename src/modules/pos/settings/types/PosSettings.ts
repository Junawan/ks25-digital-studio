export type PaperSize = "58mm" | "80mm";

export interface PosSettings {
  companyId: string;

  // Informasi toko
  address: string;
  phone: string;
  email: string | null;
  website: string | null;

  // Branding
  logoUrl: string | null;

  // Pembayaran
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrisImageUrl: string | null;

  // Struk
  receiptFooter: string;
  paperSize: PaperSize;
  autoPrint: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_RECEIPT_FOOTER =
  "Terima kasih telah berbelanja.\nSemoga hari Anda menyenangkan.";

export const DEFAULT_POS_SETTINGS: Omit<
  PosSettings,
  "companyId" | "createdAt" | "updatedAt"
> = {
  address: "",
  phone: "",
  email: null,
  website: null,

  logoUrl: null,

  bankName: "",
  accountNumber: "",
  accountHolder: "",
  qrisImageUrl: null,

  receiptFooter: DEFAULT_RECEIPT_FOOTER,
  paperSize: "58mm",
  autoPrint: false,
};