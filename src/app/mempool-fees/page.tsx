import type { Metadata } from "next";
import { MempoolFees } from "./mempool-fees";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "mempool 수수료",
  description: "비트코인 트랜잭션 권장 수수료. mempool.space 기준 sat/vB로 실시간 수수료를 확인하세요.",
  keywords: ["mempool", "비트코인 수수료", "sat/vB", "트랜잭션 수수료"],
  openGraph: {
    title: "mempool 수수료 | BTC Tools",
    description: "비트코인 트랜잭션 권장 수수료 sat/vB",
    url: absoluteUrl("/mempool-fees"),
  },
  alternates: { canonical: absoluteUrl("/mempool-fees") },
};

export default function MempoolFeesPage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-xl font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-2xl md:text-[2.5rem]">
        mempool 수수료
      </h1>
      <p className="mb-8 text-sm leading-7 text-[#37352f99] dark:text-[#ebebeb99] md:mb-12 md:text-base">
        비트코인 트랜잭션 권장 수수료 (sat/vB)
      </p>
      <MempoolFees />
    </div>
  );
}
