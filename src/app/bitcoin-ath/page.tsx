import { BitcoinAth } from "./bitcoin-ath";

export default function BitcoinAthPage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-xl font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-2xl md:text-[2.5rem]">
        비트코인 최고가 대비 가격
      </h1>
      <p className="mb-8 text-sm leading-7 text-[#37352f99] dark:text-[#ebebeb99] md:mb-12 md:text-base">
        비트코인 사상 최고가 대비 현재 가격 비교
      </p>
      <BitcoinAth />
    </div>
  );
}
