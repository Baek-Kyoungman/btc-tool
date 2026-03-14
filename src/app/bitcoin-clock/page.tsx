import type { Metadata } from "next";
import { BitcoinClock } from "./bitcoin-clock";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "비트코인 시계",
  description: "비트코인 블록 타임스탬프와 UTC 시계. 최신 블록 시간을 실시간으로 확인하세요.",
  keywords: ["비트코인 시계", "블록 타임스탬프", "BTC time", "블록체인 시간"],
  openGraph: {
    title: "비트코인 시계 | BTC Tools",
    description: "비트코인 블록 타임스탬프와 UTC 시계",
    url: absoluteUrl("/bitcoin-clock"),
  },
  alternates: { canonical: absoluteUrl("/bitcoin-clock") },
};

export default function BitcoinClockPage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-xl font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-2xl md:text-[2.5rem]">
        비트코인 시계
      </h1>
      <p className="mb-8 text-sm leading-7 text-[#37352f99] dark:text-[#ebebeb99] md:mb-12 md:text-base">
        비트코인 블록 타임스탬프와 UTC 시계
      </p>
      <BitcoinClock />
    </div>
  );
}
