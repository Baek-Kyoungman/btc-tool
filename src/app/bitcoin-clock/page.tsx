import { BitcoinClock } from "./bitcoin-clock";

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
