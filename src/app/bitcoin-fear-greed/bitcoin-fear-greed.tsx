"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Gauge } from "lucide-react";

const LABELS: Record<string, string> = {
  "Extreme Fear": "극도 공포",
  Fear: "공포",
  "Neutral": "중립",
  Greed: "탐욕",
  "Extreme Greed": "극도 탐욕",
};

function getClassificationLabel(en: string): string {
  return LABELS[en] ?? en;
}

function getGaugeColor(value: number): string {
  if (value <= 25) return "from-red-600 to-red-400";
  if (value <= 45) return "from-orange-500 to-amber-500";
  if (value <= 55) return "from-yellow-500 to-yellow-400";
  if (value <= 75) return "from-emerald-500 to-green-500";
  return "from-green-600 to-emerald-400";
}

export function BitcoinFearGreed() {
  const [value, setValue] = useState<number | null>(null);
  const [classification, setClassification] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/fear-greed");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setValue(data.value ?? null);
      setClassification(data.classification ?? "");
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

  const v = value ?? 0;
  const percent = Math.min(100, Math.max(0, v));
  const colorClass = getGaugeColor(v);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-6 dark:border-[rgba(255,255,255,0.09)]">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
          <Gauge className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          공포·탐욕 지수
        </h2>

        <div className="flex flex-col items-center gap-6">
          <div className="relative w-full max-w-xs">
            <div className="h-8 w-full overflow-hidden rounded-full bg-[rgba(55,53,47,0.08)] dark:bg-[rgba(255,255,255,0.08)]">
              <div
                className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div
              className="absolute top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-[#37352f] dark:bg-[#ebebeb]"
              style={{ left: `calc(${percent}% - 2px)` }}
            />
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-[#37352f] dark:text-[#ebebeb]">
              {v}
            </p>
            <p className="mt-1 text-lg font-medium text-[#37352f99] dark:text-[#ebebeb99]">
              {getClassificationLabel(classification)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-[#37352f99] dark:text-[#ebebeb99]">
          <span>극도 공포</span>
          <span>극도 탐욕</span>
        </div>

        {lastUpdate && (
          <p className="mt-4 text-xs text-[#37352f99] dark:text-[#ebebeb99]">
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
          공포·탐욕 지수란?
        </h2>
        <div className="space-y-3 text-sm leading-7 text-[#37352f99] dark:text-[#ebebeb99]">
          <p>
            <strong className="text-[#37352f] dark:text-[#ebebeb]">
              Fear & Greed Index
            </strong>
            는 Alternative.me에서 제공하는 암호화폐 시장 심리 지표입니다. 0(극도 공포)부터
            100(극도 탐욕)까지의 점수로 시장 참여자들의 감정을 측정합니다.
          </p>
          <p>
            변동성, 거래량·모멘텀, 소셜 미디어, 시장 지배력 등 여러 요소를 종합해 산정하며,
            매일 업데이트됩니다. 참고용으로만 활용하시고, 투자 판단은 본인의 판단에 맡기세요.
          </p>
        </div>
      </div>

    </div>
  );
}
