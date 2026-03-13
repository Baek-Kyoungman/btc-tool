"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calculator,
  Clock,
  TrendingDown,
  FileText,
  Bitcoin,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const categories = [
  { name: "사토시 계산기", href: "/satoshi-calculator", icon: Calculator },
  { name: "비트코인 시계", href: "/bitcoin-clock", icon: Clock },
  { name: "비트코인 반감기", href: "/bitcoin-halving", icon: TrendingDown },
  { name: "블로그", href: "/blog", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[rgba(55,53,47,0.09)] bg-[#f7f6f3] dark:border-[rgba(255,255,255,0.09)] dark:bg-[#191919]">
      <div className="flex h-14 items-center justify-between gap-2 border-b border-[rgba(55,53,47,0.09)] px-4 dark:border-[rgba(255,255,255,0.09)]">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Bitcoin className="h-6 w-6 text-amber-500" />
          <span className="font-semibold text-[#37352f] dark:text-[#ebebeb]">
            BTC Tools
          </span>
        </Link>
        <ThemeToggle />
      </div>
      <nav className="flex flex-col gap-0.5 p-2 pt-4">
        {categories.map((category) => {
          const isActive = pathname.startsWith(category.href);
          const Icon = category.icon;
          return (
            <Link
              key={category.href}
              href={category.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
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
  );
}
