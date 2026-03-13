import { BitcoinHalving } from "./bitcoin-halving";

export default function BitcoinHalvingPage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-[2.5rem] font-bold text-[#37352f] dark:text-[#ebebeb]">
        비트코인 반감기
      </h1>
      <p className="mb-12 text-[1rem] leading-7 text-[#37352f99] dark:text-[#ebebeb99]">
        다음 반감기까지 남은 블록 수 및 예상 일시 (210,000블록마다 발생)
      </p>
      <BitcoinHalving />
    </div>
  );
}
