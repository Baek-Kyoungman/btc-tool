import { Metadata } from "next";
import { BitcoinSupply } from "./bitcoin-supply";

export const metadata: Metadata = {
  title: "비트코인 공급량 | BTC Tools",
  description:
    "비트코인 유통 공급량, 최대 공급량, 채굴 진행률을 확인하세요.",
};

export default function BitcoinSupplyPage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-xl font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-2xl md:text-[2.5rem]">
        비트코인 공급량
      </h1>
      <p className="mb-8 text-sm leading-7 text-[#37352f99] dark:text-[#ebebeb99] md:mb-12 md:text-base">
        현재 유통 공급량, 최대 공급량, 채굴 진행률
      </p>
      <BitcoinSupply />
    </div>
  );
}
