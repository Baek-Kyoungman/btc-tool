import { BitcoinClock } from "./bitcoin-clock";

export default function BitcoinClockPage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-[2.5rem] font-bold text-[#37352f] dark:text-[#ebebeb]">
        비트코인 시계
      </h1>
      <p className="mb-12 text-[1rem] leading-7 text-[#37352f99] dark:text-[#ebebeb99]">
        비트코인 블록 타임스탬프와 UTC 시계
      </p>
      <BitcoinClock />
    </div>
  );
}
