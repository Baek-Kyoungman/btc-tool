import { Metadata } from "next";
import { MempoolFees } from "./mempool-fees";

export const metadata: Metadata = {
  title: "mempool 수수료 | BTC Tools",
  description: "비트코인 트랜잭션 수수료 추천. mempool.space 기준 sat/vB.",
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
