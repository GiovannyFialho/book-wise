import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "./globals.css";

import { Providers } from "@/providers";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Book Wise",
  description: "Book Wise project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
