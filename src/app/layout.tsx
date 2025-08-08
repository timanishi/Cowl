import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Cowl - 共用ウォレット",
  description: "友達との旅行や食事で使える精算アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}