import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/core/providers/AuthProvider";
import { WorkspaceProvider } from "@/core/workspace/WorkspaceProvider";
import { Toaster } from "sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ks25studio.web.id"),
  title: {
    default: "KS25 Digital Studio | Kasir POS dan Absensi",
    template: "%s | KS25 Digital Studio",
  },
  description:
    "KS25 Digital Studio membantu UMKM mengelola kasir POS, stok, laporan penjualan, dan absensi karyawan melalui Android dan web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
    <WorkspaceProvider>

  {children}

    </WorkspaceProvider>
  </AuthProvider>
  <Toaster
  position="top-right"
  richColors
  closeButton
/>
        </body>
    </html>
  );
}
