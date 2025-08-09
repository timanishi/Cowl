import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/providers/session-provider";
import { GoogleAdSense } from "@/components/adsense/google-adsense";

export const metadata: Metadata = {
  title: "Cowl - 共用ウォレット",
  description: "友達との旅行や食事で使える精算アプリ",
  manifest: "/manifest.json",
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