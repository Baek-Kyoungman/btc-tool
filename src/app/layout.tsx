import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { MainContent } from "@/components/layout/main-content";
import { MuiProvider } from "@/providers/mui-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { SidebarProvider } from "@/contexts/sidebar-context";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen bg-[#ffffff] antialiased dark:bg-[#191919]`}
      >
        <ThemeProvider>
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
