import type { Metadata } from "next";
import { BitcoinChart } from "./bitcoin-chart";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "비트코인 차트",
  description: "비트코인 가격 추이 차트. Upbit KRW-BTC 일봉/주봉/월봉 차트를 확인하세요.",
  keywords: ["비트코인 차트", "BTC 차트", "비트코인 가격", "Upbit"],
  openGraph: {
    title: "비트코인 차트 | BTC Tools",
    description: "비트코인 가격 추이 차트",
    url: absoluteUrl("/bitcoin-chart"),
  },
  alternates: { canonical: absoluteUrl("/bitcoin-chart") },
};

export default function BitcoinChartPage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-xl font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-2xl md:text-[2.5rem]">
        비트코인 차트
      </h1>
      <p className="mb-8 text-sm leading-7 text-[#37352f99] dark:text-[#ebebeb99] md:mb-12 md:text-base">
        비트코인 가격 추이
      </p>
      <BitcoinChart />
    </div>
  );
}
