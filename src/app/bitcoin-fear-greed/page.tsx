import type { Metadata } from "next";
import { BitcoinFearGreed } from "./bitcoin-fear-greed";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "비트코인 공포 탐욕 지수",
  description:
    "비트코인 시장 심리 지표. Alternative.me Fear & Greed Index (0=극도 공포, 100=극도 탐욕)를 한눈에 확인하세요.",
  keywords: ["공포탐욕지수", "Fear and Greed", "비트코인 시장심리", "암호화폐 지수"],
  openGraph: {
    title: "비트코인 공포 탐욕 지수 | BTC Tools",
    description: "시장 심리 지표 (0~100)",
    url: absoluteUrl("/bitcoin-fear-greed"),
  },
  alternates: { canonical: absoluteUrl("/bitcoin-fear-greed") },
};

export default function BitcoinFearGreedPage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-xl font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-2xl md:text-[2.5rem]">
        비트코인 공포 탐욕 지수
      </h1>
      <p className="mb-8 text-sm leading-7 text-[#37352f99] dark:text-[#ebebeb99] md:mb-12 md:text-base">
        시장 심리 지표 (0 = 극도 공포, 100 = 극도 탐욕)
      </p>
      <BitcoinFearGreed />
    </div>
  );
}
