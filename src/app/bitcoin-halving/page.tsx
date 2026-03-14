import type { Metadata } from "next";
import { BitcoinHalving } from "./bitcoin-halving";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "비트코인 반감기",
  description:
    "다음 비트코인 반감기까지 남은 블록 수 및 예상 일시. 210,000블록마다 채굴 보상이 절반으로 감소합니다.",
  keywords: ["비트코인 반감기", "halving", "5차 반감기", "블록 보상"],
  openGraph: {
    title: "비트코인 반감기 | BTC Tools",
    description: "다음 반감기까지 카운트다운, 예상 일시",
    url: absoluteUrl("/bitcoin-halving"),
  },
  alternates: { canonical: absoluteUrl("/bitcoin-halving") },
};

export default function BitcoinHalvingPage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-xl font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-2xl md:text-[2.5rem]">
        비트코인 반감기
      </h1>
      <p className="mb-8 text-sm leading-7 text-[#37352f99] dark:text-[#ebebeb99] md:mb-12 md:text-base">
        다음 반감기까지 남은 블록 수 및 예상 일시 (210,000블록마다 발생)
      </p>
      <BitcoinHalving />
    </div>
  );
}
