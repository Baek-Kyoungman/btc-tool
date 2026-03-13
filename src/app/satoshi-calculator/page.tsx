export default function SatoshiCalculatorPage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-[2.5rem] font-bold text-[#37352f] dark:text-[#ebebeb]">
        사토시 계산기
      </h1>
      <p className="mb-12 text-[1rem] leading-7 text-[#37352f99] dark:text-[#ebebeb99]">
        BTC, SAT(사토시), USD 실시간 변환. 1 BTC = 100,000,000 SAT
      </p>

      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-6 dark:border-[rgba(255,255,255,0.09)]">
        <p className="text-[#37352f99] dark:text-[#ebebeb99]">
          계산기 UI 구현 예정 (CoinGecko API 연동)
        </p>
      </div>
    </div>
  );
}
