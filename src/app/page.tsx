import Link from "next/link";
import { Calculator, Clock, Coins, Gauge, LineChart, TrendingDown, TrendingUp, FileText, Zap } from "lucide-react";

const categories = [
  {
    name: "비트코인 최고가 대비 가격",
    href: "/bitcoin-ath",
    icon: TrendingUp,
    description: "최고가 대비 현재 가격 비교",
  },
  {
    name: "비트코인 차트",
    href: "/bitcoin-chart",
    icon: LineChart,
    description: "비트코인 가격 차트",
  },
  {
    name: "비트코인 공포 탐욕 지수",
    href: "/bitcoin-fear-greed",
    icon: Gauge,
    description: "시장 심리 지표 (Fear & Greed)",
  },
  {
    name: "비트코인 공급량",
    href: "/bitcoin-supply",
    icon: Coins,
    description: "유통 공급량·채굴 진행률",
  },
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
    name: "mempool 수수료",
    href: "/mempool-fees",
    icon: Zap,
    description: "트랜잭션 권장 수수료 (sat/vB)",
  },
  {
    name: "블로그",
    href: "/blog",
    icon: FileText,
    description:
      "BTC Tools 블로그는 비트코인 시장, 투자 정보, 온체인 데이터, 그리고 유용한 분석 내용을 제공합니다. 복잡한 정보를 쉽게 이해할 수 있도록 정리된 비트코인 인사이트를 확인해보세요.",
  },
];

export default function HomePage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-xl font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-2xl md:text-[2.5rem]">
        BTC Tools
      </h1>
      <div className="mb-8 space-y-3 text-sm leading-7 text-[#37352f99] dark:text-[#ebebeb99] md:mb-12 md:text-base">
        <p>
          BTC Tools는 비트코인 가격 정보와 다양한 투자 분석 도구를 제공하는
          웹 서비스입니다.
        </p>
        <p>
          비트코인 차트, 최고가 대비 가격 비교, 공포 탐욕 지수, 사토시 계산기,
          반감기 카운트다운 등 비트코인 투자에 필요한 핵심 데이터를 한 곳에서
          확인할 수 있습니다.
        </p>
        <p>
          빠르고 직관적인 인터페이스를 통해 누구나 쉽게 비트코인 시장 데이터를
          분석할 수 있도록 설계되었습니다.
        </p>
      </div>

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
