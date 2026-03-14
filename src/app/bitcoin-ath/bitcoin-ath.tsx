"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";

function formatKrPrice(value: number): string {
  return value.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatAthDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function BitcoinAth() {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [athPrice, setAthPrice] = useState<number>(0);
  const [athChangePercent, setAthChangePercent] = useState<number | null>(null);
  const [athDate, setAthDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/upbit/ath");
      if (!res.ok) throw new Error("ATH fetch failed");
      const data = await res.json();
      setCurrentPrice(data.currentPrice ?? 0);
      setAthPrice(data.athPrice ?? 0);
      setAthChangePercent(data.athChangePercent ?? null);
      setAthDate(data.athDate ?? null);
      setLastUpdate(new Date());
    } catch {
      setError("ATH 데이터를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
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

  const percentFromAth =
    athChangePercent ?? (athPrice > 0 ? ((currentPrice - athPrice) / athPrice) * 100 : 0);
  const isAboveAth = currentPrice >= athPrice;
  const progressPercent = athPrice > 0 ? Math.min(100, (currentPrice / athPrice) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* 현재가 / ATH 카드 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[rgba(55,53,47,0.09)] bg-white p-6 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1f1f1f]">
          <p className="mb-1 text-sm text-[#37352f99] dark:text-[#ebebeb99]">
            현재 가격 (KRW)
          </p>
          <p className="text-2xl font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-3xl">
            {formatKrPrice(currentPrice)}
          </p>
          {lastUpdate && (
            <p className="mt-2 text-xs text-[#37352f99] dark:text-[#ebebeb99]">
              {lastUpdate.toLocaleString("ko-KR", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              기준
            </p>
          )}
        </div>
        <div className="rounded-lg border border-[rgba(55,53,47,0.09)] bg-white p-6 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1f1f1f]">
          <p className="mb-1 text-sm text-[#37352f99] dark:text-[#ebebeb99]">
            사상 최고가 (ATH)
          </p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 sm:text-3xl">
            {formatKrPrice(athPrice)}
          </p>
          {athDate && (
            <p className="mt-2 text-xs text-[#37352f99] dark:text-[#ebebeb99]">
              {formatAthDate(athDate)} 도달
            </p>
          )}
        </div>
      </div>

      {/* ATH 대비 퍼센트 */}
      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] bg-white p-6 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1f1f1f]">
        <p className="mb-2 text-sm font-medium text-[#37352f] dark:text-[#ebebeb]">
          ATH 대비 가격
        </p>
        <div className="mb-4 flex items-baseline gap-2">
          <span
            className={`text-3xl font-bold sm:text-4xl ${
              isAboveAth ? "text-red-500" : "text-blue-500"
            }`}
          >
            {percentFromAth >= 0 ? "+" : ""}
            {percentFromAth.toFixed(2)}%
          </span>
          <span className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
            {isAboveAth ? "ATH 돌파" : "ATH 미달"}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[rgba(55,53,47,0.08)] dark:bg-[rgba(255,255,255,0.08)]">
          <div
            className={`h-full rounded-full transition-all ${
              isAboveAth ? "bg-red-500" : "bg-amber-500"
            }`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[#37352f99] dark:text-[#ebebeb99]">
          현재 가격은 ATH의 {progressPercent.toFixed(1)}% 수준입니다.
        </p>
      </div>

      {/* 새로고침 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setLoading(true);
            fetchData();
          }}
          className="flex items-center gap-2 rounded-md border border-[rgba(55,53,47,0.2)] px-4 py-2 text-sm text-[#37352f] transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:hover:bg-[rgba(255,255,255,0.04)]"
        >
          <RefreshCw className="h-4 w-4" />
          새로고침
        </button>
      </div>

      <p className="text-center text-xs text-[#37352f99] dark:text-[#ebebeb99]">
        Upbit API · 면책조항
      </p>
    </div>
  );
}
