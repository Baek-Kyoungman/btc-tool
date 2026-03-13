"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calculator,
  Clock,
  Coins,
  Gauge,
  TrendingDown,
  TrendingUp,
  FileText,
  Bitcoin,
  LineChart,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const categories = [
  { name: "비트코인 최고가 대비 가격", href: "/bitcoin-ath", icon: TrendingUp },
  { name: "비트코인 차트", href: "/bitcoin-chart", icon: LineChart },
  { name: "비트코인 공포 탐욕 지수", href: "/bitcoin-fear-greed", icon: Gauge },
  { name: "비트코인 공급량", href: "/bitcoin-supply", icon: Coins },
  { name: "사토시 계산기", href: "/satoshi-calculator", icon: Calculator },
  { name: "비트코인 시계", href: "/bitcoin-clock", icon: Clock },
  { name: "비트코인 반감기", href: "/bitcoin-halving", icon: TrendingDown },
  { name: "블로그", href: "/blog", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* 모바일 상단 바 */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 min-h-[3.5rem] items-center justify-between gap-2 border-b border-[rgba(55,53,47,0.09)] bg-[#f7f6f3] px-4 pt-[env(safe-area-inset-top)] dark:border-[rgba(255,255,255,0.09)] dark:bg-[#191919] md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 -ml-2 items-center justify-center rounded-md text-[#37352f] transition-colors hover:bg-[rgba(55,53,47,0.08)] dark:text-[#ebebeb] dark:hover:bg-[rgba(255,255,255,0.08)]"
          aria-label="메뉴 열기"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
          onClick={closeMobile}
        >
          <Bitcoin className="h-5 w-5 text-amber-500" />
          <span className="font-semibold text-[#37352f] dark:text-[#ebebeb]">
            BTC Tools
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* 모바일 오버레이 */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeMobile}
          aria-hidden
        />
      )}

      {/* 데스크톱 사이드바 / 모바일 드로어 */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-[rgba(55,53,47,0.09)] bg-[#f7f6f3] transition-transform duration-200 ease-out dark:border-[rgba(255,255,255,0.09)] dark:bg-[#191919]",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-[rgba(55,53,47,0.09)] px-4 dark:border-[rgba(255,255,255,0.09)]">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            onClick={closeMobile}
          >
            <Bitcoin className="h-6 w-6 text-amber-500" />
            <span className="font-semibold text-[#37352f] dark:text-[#ebebeb]">
              BTC Tools
            </span>
          </Link>
          <button
            type="button"
            onClick={closeMobile}
            className="flex h-10 w-10 items-center justify-center rounded-md text-[#37352f99] transition-colors hover:bg-[rgba(55,53,47,0.08)] hover:text-[#37352f] md:hidden dark:text-[#ebebeb99] dark:hover:bg-[rgba(255,255,255,0.08)] dark:hover:text-[#ebebeb]"
            aria-label="메뉴 닫기"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 p-2 pt-4">
          {categories.map((category) => {
            const isActive = pathname.startsWith(category.href);
            const Icon = category.icon;
            return (
              <Link
                key={category.href}
                href={category.href}
                onClick={closeMobile}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-[rgba(55,53,47,0.08)] text-[#37352f] dark:bg-[rgba(255,255,255,0.08)] dark:text-[#ebebeb]"
                    : "text-[#37352f99] hover:bg-[rgba(55,53,47,0.04)] hover:text-[#37352f] dark:text-[#ebebeb99] dark:hover:bg-[rgba(255,255,255,0.04)] dark:hover:text-[#ebebeb]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {category.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
