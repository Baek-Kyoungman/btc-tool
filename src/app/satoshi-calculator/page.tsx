import type { Metadata } from "next";
import { SatoshiCalculator } from "./satoshi-calculator";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "사토시 계산기",
  description: "BTC ↔ SAT ↔ KRW ↔ USD 실시간 변환. 비트코인과 사토시를 원화·달러로 즉시 계산하세요.",
  keywords: ["사토시 계산기", "BTC 계산기", "SAT 변환", "비트코인 환율"],
  openGraph: {
    title: "사토시 계산기 | BTC Tools",
    description: "BTC, SAT, KRW, USD 실시간 변환 계산기",
    url: absoluteUrl("/satoshi-calculator"),
  },
  alternates: { canonical: absoluteUrl("/satoshi-calculator") },
};

export default function SatoshiCalculatorPage() {
  return (
    <div className="notion-style">
      <SatoshiCalculator />
    </div>
  );
}
