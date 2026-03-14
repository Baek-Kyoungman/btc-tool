import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { MainContent } from "@/components/layout/main-content";
import { MuiProvider } from "@/providers/mui-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { ExtensionErrorSuppress } from "@/components/extension-error-suppress";

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
  title: "BTC Tools - 사토시 계산기, 비트코인 시계, 반감기",
  description:
    "비트코인 사토시 계산기, 실시간 시계, 반감기 카운트다운 및 블로그. AdSense 승인을 위한 품질 콘텐츠",
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
