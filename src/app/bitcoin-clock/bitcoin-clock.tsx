"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock, RefreshCw } from "lucide-react";

const GENESIS_TIMESTAMP = 1231006505; // 2009-01-03 18:15:05 UTC

interface BlockInfo {
  height: number;
  timestamp: number;
}

function formatUtc(date: Date): string {
  return date
    .toISOString()
    .replace("T", " ")
    .replace("Z", " UTC");
}

function formatTimeSince(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}일`);
  if (hours > 0) parts.push(`${hours}시간`);
  parts.push(`${mins}분`);
  return parts.join(" ");
}

export function BitcoinClock() {
  const [now, setNow] = useState(new Date());
  const [block, setBlock] = useState<BlockInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlock = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("https://blockstream.info/api/blocks/tip");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const tip = Array.isArray(data) ? data[0] : data;
      setBlock({
        height: tip.height,
        timestamp: tip.timestamp,
      });
    } catch {
      setError("블록 정보를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetchBlock();
  }, [fetchBlock]);

  const genesisDate = new Date(GENESIS_TIMESTAMP * 1000);
  const blockDate = block ? new Date(block.timestamp * 1000) : null;
  const secondsSinceGenesis = Math.floor(now.getTime() / 1000 - GENESIS_TIMESTAMP);

  return (
    <div className="space-y-8">
      {/* UTC 시계 */}
      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-6 dark:border-[rgba(255,255,255,0.09)]">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
            현재 UTC 시각
          </h2>
        </div>
        <p className="font-mono text-2xl font-medium text-[#37352f] dark:text-[#ebebeb] sm:text-3xl">
          {formatUtc(now)}
        </p>
        <p className="mt-2 text-sm text-[#37352f99] dark:text-[#ebebeb99]">
          Unix: {Math.floor(now.getTime() / 1000)}
        </p>
      </div>

      {/* 블록 타임스탬프 */}
      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-6 dark:border-[rgba(255,255,255,0.09)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
            최신 블록 타임스탬프
          </h2>
          <button
            onClick={fetchBlock}
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
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          </div>
        ) : block ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-[rgba(55,53,47,0.04)] p-4 dark:bg-[rgba(255,255,255,0.04)]">
              <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
                블록 높이
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-[#37352f] dark:text-[#ebebeb]">
                {block.height.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-[rgba(55,53,47,0.04)] p-4 dark:bg-[rgba(255,255,255,0.04)]">
              <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
                블록 타임스탬프 (UTC)
              </p>
              <p className="mt-1 font-mono text-lg text-[#37352f] dark:text-[#ebebeb]">
                {blockDate ? formatUtc(blockDate) : "-"}
              </p>
              <p className="mt-1 text-sm text-[#37352f99] dark:text-[#ebebeb99]">
                Unix: {block.timestamp}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Genesis 블록 이후 */}
      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-6 dark:border-[rgba(255,255,255,0.09)]">
        <h2 className="mb-4 text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
          Genesis 블록 이후
        </h2>
        <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
          Genesis 블록: {formatUtc(genesisDate)}
        </p>
        <p className="mt-4 text-2xl font-semibold text-amber-600 dark:text-amber-400">
          {formatTimeSince(secondsSinceGenesis)} 경과
        </p>
      </div>

      <p className="mt-10 pt-6 text-center text-[10px] text-[#37352f66] dark:text-[#ebebeb66]">
        데이터 출처: Blockstream.info
      </p>
    </div>
  );
}
