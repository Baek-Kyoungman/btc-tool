"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Zap } from "lucide-react";

interface FeeData {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
}

const FEE_LABELS: { key: keyof FeeData; label: string; desc: string }[] = [
  { key: "fastestFee", label: "다음 블록", desc: "가장 빠른 확인" },
  { key: "halfHourFee", label: "30분 이내", desc: "약 3블록" },
  { key: "hourFee", label: "1시간 이내", desc: "약 6블록" },
  { key: "economyFee", label: "경제", desc: "24블록 이상" },
  { key: "minimumFee", label: "최소", desc: "릴레이 수수료" },
];

export function MempoolFees() {
  const [fees, setFees] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/mempool/fees");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setFees(data);
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

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-6 dark:border-[rgba(255,255,255,0.09)]">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
          <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          수수료 추천 (sat/vB)
        </h2>

        <div className="space-y-3">
          {FEE_LABELS.map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg bg-[rgba(55,53,47,0.04)] p-4 dark:bg-[rgba(255,255,255,0.04)]"
            >
              <div>
                <p className="font-medium text-[#37352f] dark:text-[#ebebeb]">
                  {label}
                </p>
                <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
                  {desc}
                </p>
              </div>
              <p className="font-mono text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
                {(fees?.[key] ?? 0).toLocaleString()} sat/vB
              </p>
            </div>
          ))}
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
          mempool 수수료란?
        </h2>
        <div className="space-y-3 text-sm leading-7 text-[#37352f99] dark:text-[#ebebeb99]">
          <p>
            비트코인 트랜잭션은 채굴자가 블록에 포함시켜야 네트워크에 확인됩니다.
            수수료(sat/vB)가 높을수록 우선 처리될 가능성이 큽니다.
          </p>
          <p>
            위 데이터는 <strong className="text-[#37352f] dark:text-[#ebebeb]">mempool.space</strong>에서
            제공하며, 현재 메모리 풀 상태를 바탕으로 추천 수수료를 표시합니다. 트랜잭션 크기와 긴급도에 맞춰
            선택하세요.
          </p>
        </div>
      </div>

      <p className="mt-10 pt-6 text-center text-[10px] text-[#37352f66] dark:text-[#ebebeb66]">
        데이터 출처: mempool.space
      </p>
    </div>
  );
}
