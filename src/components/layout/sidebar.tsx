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
  LineChart,
  Menu,
  PanelLeft,
  PanelLeftClose,
  TrendingDown,
  TrendingUp,
  FileText,
  Bitcoin,
  X,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useSidebar } from "@/contexts/sidebar-context";

const categories = [
  { name: "비트코인 최고가 대비 가격", href: "/bitcoin-ath", icon: TrendingUp },
  { name: "비트코인 차트", href: "/bitcoin-chart", icon: LineChart },
  { name: "비트코인 공포 탐욕 지수", href: "/bitcoin-fear-greed", icon: Gauge },
  { name: "비트코인 공급량", href: "/bitcoin-supply", icon: Coins },
  { name: "사토시 계산기", href: "/satoshi-calculator", icon: Calculator },
  { name: "비트코인 시계", href: "/bitcoin-clock", icon: Clock },
  { name: "비트코인 반감기", href: "/bitcoin-halving", icon: TrendingDown },
  { name: "mempool 수수료", href: "/mempool-fees", icon: Zap },
  { name: "블로그", href: "/blog", icon: FileText },
];

const TOOLTIP_OFFSET = 12;

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, toggle } = useSidebar();
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const closeMobile = () => setMobileOpen(false);

  const showTooltip = (text: string) => (e: React.MouseEvent) => {
    if (!collapsed) return;
    setTooltip({ text, x: e.clientX, y: e.clientY });
  };
  const moveTooltip = (text: string) => (e: React.MouseEvent) => {
    if (!collapsed || !tooltip) return;
    setTooltip({ text, x: e.clientX, y: e.clientY });
  };
  const hideTooltip = () => setTooltip(null);

  return (
    <>
      {/* 마우스 따라가는 툴팁 (접힌 상태) */}
      {collapsed && tooltip && (
        <div
          className="pointer-events-none fixed z-[200] whitespace-nowrap rounded-md border border-[rgba(55,53,47,0.12)] bg-[#f7f6f3] px-2.5 py-1.5 text-xs font-medium text-[#37352f] shadow-lg dark:border-[rgba(255,255,255,0.12)] dark:bg-[#252525] dark:text-[#ebebeb]"
          style={{
            left: tooltip.x + TOOLTIP_OFFSET,
            top: tooltip.y + TOOLTIP_OFFSET,
          }}
        >
          {tooltip.text}
        </div>
      )}

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
          "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[rgba(55,53,47,0.09)] bg-[#f7f6f3] transition-[width,transform] duration-200 ease-out dark:border-[rgba(255,255,255,0.09)] dark:bg-[#191919]",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed && "md:w-16"
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-[rgba(55,53,47,0.09)] dark:border-[rgba(255,255,255,0.09)]",
            collapsed ? "justify-center px-0" : "justify-between gap-2 px-4"
          )}
        >
          <div className="relative">
            <Link
              href="/"
              className={cn(
                "flex items-center transition-opacity hover:opacity-80",
                collapsed ? "justify-center p-2" : "gap-2"
              )}
              onClick={closeMobile}
              onMouseEnter={showTooltip("홈")}
              onMouseMove={moveTooltip("홈")}
              onMouseLeave={hideTooltip}
            >
              <Bitcoin className="h-6 w-6 shrink-0 text-amber-500" />
              {!collapsed && (
                <span className="font-semibold text-[#37352f] dark:text-[#ebebeb]">
                  BTC Tools
                </span>
              )}
            </Link>
          </div>
          {!collapsed && (
            <>
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
            </>
          )}
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-visible p-2 pt-4">
          {categories.map((category) => {
            const isActive = pathname.startsWith(category.href);
            const Icon = category.icon;
            return (
              <Link
                key={category.href}
                href={category.href}
                onClick={closeMobile}
                onMouseEnter={showTooltip(category.name)}
                onMouseMove={moveTooltip(category.name)}
                onMouseLeave={hideTooltip}
                className={cn(
                  "flex items-center rounded-md py-2.5 text-sm transition-colors",
                  collapsed ? "justify-center px-0" : "gap-3 px-3",
                  isActive
                    ? "bg-[rgba(55,53,47,0.08)] text-[#37352f] dark:bg-[rgba(255,255,255,0.08)] dark:text-[#ebebeb]"
                    : "text-[#37352f99] hover:bg-[rgba(55,53,47,0.04)] hover:text-[#37352f] dark:text-[#ebebeb99] dark:hover:bg-[rgba(255,255,255,0.04)] dark:hover:text-[#ebebeb]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{category.name}</span>}
              </Link>
            );
          })}
          <div className="mt-auto hidden flex-col gap-0.5 md:flex">
            {collapsed && (
              <div
                className="flex justify-center py-2"
                onMouseEnter={showTooltip("테마 변경")}
                onMouseMove={moveTooltip("테마 변경")}
                onMouseLeave={hideTooltip}
              >
                <ThemeToggle />
              </div>
            )}
            <button
              type="button"
              onClick={toggle}
              onMouseEnter={showTooltip("사이드바 펼치기")}
              onMouseMove={moveTooltip("사이드바 펼치기")}
              onMouseLeave={hideTooltip}
              className={cn(
                "flex w-full items-center rounded-md py-2.5 text-sm text-[#37352f99] transition-colors hover:bg-[rgba(55,53,47,0.04)] hover:text-[#37352f] dark:text-[#ebebeb99] dark:hover:bg-[rgba(255,255,255,0.04)] dark:hover:text-[#ebebeb]",
                collapsed ? "justify-center px-0" : "gap-3 px-3"
              )}
              aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
            >
              {collapsed ? (
                <PanelLeft className="h-4 w-4 shrink-0" />
              ) : (
                <>
                  <PanelLeftClose className="h-4 w-4 shrink-0" />
                  <span>사이드바 접기</span>
                </>
              )}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
