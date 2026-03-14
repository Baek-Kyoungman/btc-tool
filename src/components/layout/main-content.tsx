"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/sidebar-context";

const DATA_SOURCE_MAP: Record<string, string> = {
  "/bitcoin-ath": "Upbit API",
  "/bitcoin-chart": "Upbit API",
  "/bitcoin-fear-greed": "CoinMarketCap API",
  "/bitcoin-supply": "Blockchain.info",
  "/satoshi-calculator": "Upbit API, Binance API",
  "/bitcoin-clock": "Blockstream.info",
  "/bitcoin-halving": "Blockstream.info",
  "/mempool-fees": "mempool.space",
};

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { collapsed, position } = useSidebar();
  const dataSource = DATA_SOURCE_MAP[pathname] ?? null;
  return (
    <main
      className={`flex min-h-screen flex-1 flex-col pb-16 pt-14 transition-[padding] duration-200 md:pb-16 md:pt-16 ${
        position === "left"
          ? collapsed
            ? "md:pl-16"
            : "md:pl-64"
          : collapsed
            ? "md:pr-16"
            : "md:pr-64"
      }`}
    >
      <div className="mx-auto flex-1 w-full max-w-[900px] px-4 py-6 md:px-12 md:py-16">
        {children}
      </div>
      <footer className="mx-auto w-full max-w-[900px] space-y-4 px-4 py-6 text-center text-xs text-[#37352f66] md:px-12 dark:text-[#ebebeb66]">
        {dataSource && <p>데이터 출처: {dataSource}</p>}
        <p className="leading-relaxed">
          이 사이트에 게시된 모든 내용은 정보 제공 및 참고를 위한 것이며, 특정
          투자나 자산 매수를 권유하기 위한 목적이 아닙니다. 비트코인을 포함한
          모든 투자 결정은 각자의 판단과 책임에 따라 이루어져야 합니다. 본
          사이트의 콘텐츠는 투자 판단을 위한 참고 자료로만 활용해 주시기
          바랍니다.
        </p>
        <p>© 2026 BTC Tools. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
