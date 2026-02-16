import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lembaga Hukum Malahayati | Solusi Hukum Profesional dan Terpercaya",
    template: "%s | Lembaga Hukum Malahayati",
  },
  description: "Lembaga hukum yang memberikan layanan konsultasi dan pendampingan hukum secara profesional, transparan, dan terpercaya untuk individu maupun perusahaan.",
  keywords: ["Lembaga Hukum", "Konsultasi Hukum", "Pendampingan Hukum", "Pengacara", "Advokat", "Malahayati", "Jakarta"],
  authors: [{ name: "Lembaga Hukum Malahayati" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Lembaga Hukum Malahayati",
    description: "Solusi Hukum Profesional dan Terpercaya",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
