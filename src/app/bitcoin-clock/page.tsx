export default function BitcoinClockPage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-[2.5rem] font-bold text-[#37352f] dark:text-[#ebebeb]">
        비트코인 시계
      </h1>
      <p className="mb-12 text-[1rem] leading-7 text-[#37352f99] dark:text-[#ebebeb99]">
        비트코인 블록 타임스탬프와 UTC 시계
      </p>

      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-6 dark:border-[rgba(255,255,255,0.09)]">
        <p className="text-[#37352f99] dark:text-[#ebebeb99]">
          시계 UI 구현 예정 (Blockchain API 연동)
        </p>
      </div>
    </div>
  );
}
