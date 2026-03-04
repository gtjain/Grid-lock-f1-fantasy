import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grid Lock",
  description: "A premium F1 fantasy racing experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-slate-900 text-slate-50 antialiased min-h-screen selection:bg-red-500/30`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
