"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingDown, RefreshCw } from "lucide-react";

const BLOCKS_PER_HALVING = 210_000;
const AVERAGE_BLOCK_TIME_SEC = 600; // ~10분
const NEXT_HALVING_BLOCK = 1_050_000; // 5차 반감기
const LAST_HALVING_BLOCK = 840_000; // 4차 반감기 (2024)

interface HalvingEvent {
  number: number;
  block: number;
  year: string;
  rewardBefore: string;
  rewardAfter: string;
}

const HALVING_HISTORY: HalvingEvent[] = [
  { number: 1, block: 210_000, year: "2012-11-28", rewardBefore: "50 BTC", rewardAfter: "25 BTC" },
  { number: 2, block: 420_000, year: "2016-07-09", rewardBefore: "25 BTC", rewardAfter: "12.5 BTC" },
  { number: 3, block: 630_000, year: "2020-05-11", rewardBefore: "12.5 BTC", rewardAfter: "6.25 BTC" },
  { number: 4, block: 840_000, year: "2024-04-20", rewardBefore: "6.25 BTC", rewardAfter: "3.125 BTC" },
  { number: 5, block: 1_050_000, year: "~2028-04", rewardBefore: "3.125 BTC", rewardAfter: "1.5625 BTC" },
  { number: 6, block: 1_260_000, year: "~2032", rewardBefore: "1.5625 BTC", rewardAfter: "0.78125 BTC" },
  { number: 7, block: 1_470_000, year: "~2036", rewardBefore: "0.78125 BTC", rewardAfter: "0.390625 BTC" },
  { number: 8, block: 1_680_000, year: "~2040", rewardBefore: "0.390625 BTC", rewardAfter: "0.1953125 BTC" },
  { number: 9, block: 1_890_000, year: "~2044", rewardBefore: "0.1953125 BTC", rewardAfter: "0.09765625 BTC" },
  { number: 10, block: 2_100_000, year: "~2048", rewardBefore: "0.09765625 BTC", rewardAfter: "0.048828125 BTC" },
];

function formatTimeLeft(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}일`);
  if (hours > 0) parts.push(`${hours}시간`);
  parts.push(`${minutes}분`);
  return parts.join(" ");
}

export function BitcoinHalving() {
  const [currentBlock, setCurrentBlock] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchBlockHeight = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("https://blockstream.info/api/blocks/tip/height");
      if (!res.ok) throw new Error("Failed to fetch");
      const height = parseInt(await res.text(), 10);
      setCurrentBlock(height);
      setLastFetch(new Date());
    } catch {
      setError("블록 높이를 불러올 수 없습니다.");
      setCurrentBlock(940_000); // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlockHeight();
  }, [fetchBlockHeight]);

  const block = currentBlock ?? 0;
  const blocksRemaining = Math.max(0, NEXT_HALVING_BLOCK - block);
  const secondsUntilHalving = blocksRemaining * AVERAGE_BLOCK_TIME_SEC;
  const timeLeftStr = formatTimeLeft(secondsUntilHalving);
  const progress =
    block >= LAST_HALVING_BLOCK
      ? ((block - LAST_HALVING_BLOCK) / BLOCKS_PER_HALVING) * 100
      : 0;

  return (
    <div className="space-y-8">
      {/* 메인 카운트다운 카드 */}
      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-6 dark:border-[rgba(255,255,255,0.09)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
            5차 반감기까지
          </h2>
          <button
            onClick={fetchBlockHeight}
            disabled={loading}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#37352f99] transition-colors hover:bg-[rgba(55,53,47,0.06)] hover:text-[#37352f] disabled:opacity-50 dark:text-[#ebebeb99] dark:hover:bg-[rgba(255,255,255,0.06)] dark:hover:text-[#ebebeb]"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-amber-600 dark:text-amber-400">
            {error}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-6 sm:grid-cols-3">
              <div className="rounded-lg bg-[rgba(55,53,47,0.04)] p-4 dark:bg-[rgba(255,255,255,0.04)]">
                <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
                  현재 블록
                </p>
                <p className="mt-1 font-mono text-xl font-semibold text-[#37352f] dark:text-[#ebebeb]">
                  {block.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-[rgba(55,53,47,0.04)] p-4 dark:bg-[rgba(255,255,255,0.04)]">
                <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
                  남은 블록
                </p>
                <p className="mt-1 font-mono text-xl font-semibold text-amber-600 dark:text-amber-400">
                  {blocksRemaining.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-[rgba(55,53,47,0.04)] p-4 dark:bg-[rgba(255,255,255,0.04)]">
                <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
                  예상 일시
                </p>
                <p className="mt-1 text-lg font-medium text-[#37352f] dark:text-[#ebebeb]">
                  ~2028년 4월
                </p>
              </div>
            </div>

            {/* 진행률 바 */}
            <div className="mb-2 flex justify-between text-sm text-[#37352f99] dark:text-[#ebebeb99]">
              <span>4차 반감기 이후 진행률</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="mb-6 h-3 overflow-hidden rounded-full bg-[rgba(55,53,47,0.09)] dark:bg-[rgba(255,255,255,0.09)]">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-lg border border-[rgba(55,53,47,0.09)] bg-amber-500/5 p-4 dark:border-[rgba(255,255,255,0.09)]">
              <TrendingDown className="h-8 w-8 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-medium text-[#37352f] dark:text-[#ebebeb]">
                  예상 남은 시간
                </p>
                <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400">
                  {timeLeftStr}
                </p>
                <p className="text-xs text-[#37352f99] dark:text-[#ebebeb99]">
                  블록당 약 10분 기준 추정
                </p>
              </div>
            </div>
          </>
        )}

        {lastFetch && !loading && (
          <p className="mt-4 text-xs text-[#37352f55] dark:text-[#ebebeb55]">
            마지막 업데이트: {lastFetch.toLocaleTimeString("ko-KR")}
          </p>
        )}
      </div>

      {/* 반감기 히스토리 */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
          반감기 히스토리
        </h2>
        <div className="overflow-hidden rounded-lg border border-[rgba(55,53,47,0.09)] dark:border-[rgba(255,255,255,0.09)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(55,53,47,0.09)] bg-[rgba(55,53,47,0.04)] dark:border-b-[rgba(255,255,255,0.09)] dark:bg-[rgba(255,255,255,0.04)]">
                <th className="px-4 py-3 text-left font-medium text-[#37352f] dark:text-[#ebebeb]">
                  #
                </th>
                <th className="px-4 py-3 text-left font-medium text-[#37352f] dark:text-[#ebebeb]">
                  블록
                </th>
                <th className="px-4 py-3 text-left font-medium text-[#37352f] dark:text-[#ebebeb]">
                  일시
                </th>
                <th className="px-4 py-3 text-left font-medium text-[#37352f] dark:text-[#ebebeb]">
                  보상 변경
                </th>
              </tr>
            </thead>
            <tbody>
              {HALVING_HISTORY.map((h) => (
                <tr
                  key={h.number}
                  className="border-b border-[rgba(55,53,47,0.09)] last:border-0 dark:border-b-[rgba(255,255,255,0.09)]"
                >
                  <td className="px-4 py-3 font-medium text-[#37352f] dark:text-[#ebebeb]">
                    {h.number}차
                  </td>
                  <td className="px-4 py-3 font-mono text-[#37352f99] dark:text-[#ebebeb99]">
                    {h.block.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-[#37352f99] dark:text-[#ebebeb99]">
                    {h.year}
                  </td>
                  <td className="px-4 py-3 text-[#37352f99] dark:text-[#ebebeb99]">
                    {h.rewardBefore} → {h.rewardAfter}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
