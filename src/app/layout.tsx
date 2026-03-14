import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { MainContent } from "@/components/layout/main-content";
import { MuiProvider } from "@/providers/mui-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { ExtensionErrorSuppress } from "@/components/extension-error-suppress";
import { SITE_NAME, SITE_DESCRIPTION, getSiteUrl } from "@/lib/seo";

const EXTENSION_ERROR_SUPPRESS = `
(function(){
  function isExtensionError(msg, src) {
    if (!msg) return false;
    var s = String(msg);
    var isExt = !src || String(src).indexOf('chrome-extension://') === 0;
    if (!isExt) return false;
    if (s.indexOf('Origin not allowed') !== -1) return true;
    if (s.indexOf('sseError not found') !== -1) return true;
    return false;
  }
  var orig = window.onerror;
  window.onerror = function(msg, src, line, col, err) {
    if (isExtensionError(msg, src)) return true;
    if (orig) return orig.apply(this, arguments);
    return false;
  };
  window.addEventListener('error', function(e) {
    if (isExtensionError(e.message, e.filename)) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return true;
    }
  }, true);
  window.addEventListener('unhandledrejection', function(e) {
    var msg = e.reason && (e.reason.message || String(e.reason));
    if (msg && (msg.indexOf('Origin not allowed') !== -1 || msg.indexOf('sseError not found') !== -1)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} - 사토시 계산기, 비트코인 시계, 반감기`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "비트코인",
    "BTC",
    "사토시",
    "사토시 계산기",
    "비트코인 시계",
    "비트코인 반감기",
    "비트코인 차트",
    "공포탐욕지수",
    "비트코인 공급량",
  ],
  authors: [{ name: SITE_NAME, url: getSiteUrl() }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - 사토시 계산기, 비트코인 시계, 반감기`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - 사토시 계산기, 비트코인 시계, 반감기`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: getSiteUrl(),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7122591795881411"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{ __html: EXTENSION_ERROR_SUPPRESS }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen bg-[#ffffff] antialiased dark:bg-[#191919]`}
      >
        <ThemeProvider>
          <ExtensionErrorSuppress />
          <MuiProvider>
            <SidebarProvider>
              <Sidebar />
              <MainContent>{children}</MainContent>
            </SidebarProvider>
          </MuiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
