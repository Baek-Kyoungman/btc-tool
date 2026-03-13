import Link from "next/link";
import { Calculator, Clock, TrendingDown, FileText } from "lucide-react";

const categories = [
  {
    name: "사토시 계산기",
    href: "/satoshi-calculator",
    icon: Calculator,
    description: "BTC ↔ SAT ↔ USD 실시간 변환",
  },
  {
    name: "비트코인 시계",
    href: "/bitcoin-clock",
    icon: Clock,
    description: "비트코인 블록 타임스탬프 시계",
  },
  {
    name: "비트코인 반감기",
    href: "/bitcoin-halving",
    icon: TrendingDown,
    description: "다음 반감기까지 카운트다운",
  },
  {
    name: "블로그",
    href: "/blog",
    icon: FileText,
    description: "비트코인 관련 아티클",
  },
];

export default function HomePage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-[2.5rem] font-bold text-[#37352f] dark:text-[#ebebeb]">
        BTC Tools
      </h1>
      <p className="mb-12 text-[1rem] leading-7 text-[#37352f99] dark:text-[#ebebeb99]">
        비트코인 유틸리티 도구 모음. 사토시 계산, 실시간 시계, 반감기 정보를
        제공합니다.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.href}
              href={category.href}
              className="group flex items-start gap-4 rounded-lg border border-[rgba(55,53,47,0.09)] p-4 transition-colors hover:border-[rgba(55,53,47,0.2)] hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.09)] dark:hover:border-[rgba(255,255,255,0.2)] dark:hover:bg-[rgba(255,255,255,0.04)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
                <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
                  {category.name}
                </h2>
                <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
                  {category.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
