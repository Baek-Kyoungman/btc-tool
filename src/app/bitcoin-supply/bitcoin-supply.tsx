"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Coins } from "lucide-react";

function formatBtc(value: number): string {
  return value.toLocaleString("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function BitcoinSupply() {
  const [circulating, setCirculating] = useState<number | null>(null);
  const [max, setMax] = useState<number>(21_000_000);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [percentMined, setPercentMined] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/bitcoin-supply");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setCirculating(data.circulating ?? null);
      setMax(data.max ?? 21_000_000);
      setRemaining(data.remaining ?? null);
      setPercentMined(data.percentMined ?? null);
      setLastUpdate(new Date());
    } catch {
      setError("데이터를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-8 dark:border-[rgba(255,255,255,0.09)]">
        <p className="text-amber-600 dark:text-amber-400">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            fetchData();
          }}
          className="mt-4 flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </button>
      </div>
    );
  }

  const pct = percentMined ?? 0;

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-6 dark:border-[rgba(255,255,255,0.09)]">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
          <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          공급량 현황
        </h2>

        <div className="space-y-4">
          <div className="rounded-lg bg-[rgba(55,53,47,0.04)] p-4 dark:bg-[rgba(255,255,255,0.04)]">
            <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">현재 유통 공급량</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-[#37352f] dark:text-[#ebebeb]">
              {circulating != null ? formatBtc(circulating) : "-"} BTC
            </p>
          </div>
          <div className="rounded-lg bg-[rgba(55,53,47,0.04)] p-4 dark:bg-[rgba(255,255,255,0.04)]">
            <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">최대 공급량</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-[#37352f] dark:text-[#ebebeb]">
              {formatBtc(max)} BTC
            </p>
          </div>
          <div className="rounded-lg bg-[rgba(55,53,47,0.04)] p-4 dark:bg-[rgba(255,255,255,0.04)]">
            <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">미채굴 잔량</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-[#37352f] dark:text-[#ebebeb]">
              {remaining != null ? formatBtc(remaining) : "-"} BTC
            </p>
          </div>

          <div className="pt-2">
            <p className="mb-2 text-sm text-[#37352f99] dark:text-[#ebebeb99]">
              채굴 진행률
            </p>
            <div className="h-4 w-full overflow-hidden rounded-full bg-[rgba(55,53,47,0.08)] dark:bg-[rgba(255,255,255,0.08)]">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
            <p className="mt-2 text-right text-sm font-medium text-[#37352f] dark:text-[#ebebeb]">
              {pct.toFixed(2)}%
            </p>
          </div>
        </div>

        {lastUpdate && (
          <p className="mt-6 text-xs text-[#37352f99] dark:text-[#ebebeb99]">
            마지막 업데이트: {lastUpdate.toLocaleString("ko-KR")}
          </p>
        )}
        <button
          onClick={() => {
            setLoading(true);
            fetchData();
          }}
          className="mt-4 flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          <RefreshCw className="h-4 w-4" />
          새로고침
        </button>
      </div>

      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] bg-[rgba(55,53,47,0.02)] p-6 dark:border-[rgba(255,255,255,0.09)] dark:bg-[rgba(255,255,255,0.02)]">
        <h2 className="mb-4 text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
          비트코인 공급량이란?
        </h2>
        <div className="space-y-3 text-sm leading-7 text-[#37352f99] dark:text-[#ebebeb99]">
          <p>
            비트코인은{" "}
            <strong className="text-[#37352f] dark:text-[#ebebeb]">
              최대 2,100만 BTC
            </strong>
            로 제한되어 있습니다. 약 4년마다 반감기가 일어나며, 블록 보상이 절반으로
            줄어들어 2140년경에 모든 BTC가 채굴됩니다.
          </p>
          <p>
            위 데이터는 Blockchain.info를 기반으로 합니다. 참고용으로만 활용하세요.
          </p>
        </div>
      </div>

      <p className="mt-10 pt-6 text-center text-[10px] text-[#37352f66] dark:text-[#ebebeb66]">
        데이터 출처: Blockchain.info
      </p>
    </div>
  );
}
