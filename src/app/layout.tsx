import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/providers/session-provider";
import { GoogleAdSense } from "@/components/adsense/google-adsense";

export const metadata: Metadata = {
  title: "Cowl - 共用ウォレット | 友達との精算が簡単になるアプリ",
  description: "旅行・食事・イベントでの割り勘計算を自動化。グループでの支払い記録・精算管理が簡単にできる無料の精算アプリです。招待リンクで友達をかんたん追加、リアルタイム同期で透明な精算を実現。",
  keywords: ["精算", "割り勘", "グループ", "旅行", "食事", "共用ウォレット", "支払い管理", "アプリ"],
  authors: [{ name: "Cowl" }],
  creator: "Cowl",
  publisher: "Cowl",
  manifest: "/manifest.json",
  metadataBase: new URL('https://cowl.vercel.app'),
  alternates: {
    canonical: 'https://cowl.vercel.app',
  },
  openGraph: {
    title: "Cowl - 共用ウォレット | 友達との精算が簡単になるアプリ",
    description: "旅行・食事・イベントでの割り勘計算を自動化。グループでの支払い記録・精算管理が簡単にできる無料の精算アプリです。",
    url: 'https://cowl.vercel.app',
    siteName: 'Cowl',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cowl - 共用ウォレット",
    description: "友達との精算が簡単になる無料アプリ",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cowl",
  },
  icons: {
    icon: "/icons/cowl-icon.svg",
    apple: "/icons/cowl-icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cowl" />
        <link rel="apple-touch-icon" href="/icons/cowl-icon.svg" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
        <GoogleAdSense />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  }, function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `
        }} />
      </body>
    </html>
  );
}