"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { RefreshCw, Share2 } from "lucide-react";

const TIMEFRAMES = [
  { label: "1일", days: 1 },
  { label: "5일", days: 5 },
  { label: "1개월", days: 30 },
  { label: "6개월", days: 180 },
  { label: "연중", days: "ytd" as const },
  { label: "1년", days: 365 },
  { label: "5년", days: 1825 },
  { label: "최대", days: "max" as const },
] as const;

function formatEok(value: number): string {
  const eok = value / 100_000_000;
  return `${eok.toFixed(2)}억`;
}

function formatKrPrice(value: number): string {
  return value.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface ChartPoint {
  ts: number;
  value: number;
  label: string;
  timeLabel: string;
}

export function BitcoinChart() {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [change24h, setChange24h] = useState<number>(0);
  const [change24hPercent, setChange24hPercent] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [timeframe, setTimeframe] = useState<(typeof TIMEFRAMES)[number]>(TIMEFRAMES[0]);
  const [btcInput, setBtcInput] = useState("1");
  const [krwInput, setKrwInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [tooltip, setTooltip] = useState<{
    clientX: number;
    clientY: number;
    price: number;
    time: string;
  } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getDaysParam = useCallback(() => {
    if (timeframe.days === "ytd") {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      return String(Math.ceil((now.getTime() - start.getTime()) / 86400000));
    }
    if (timeframe.days === "max") return "max";
    return String(timeframe.days);
  }, [timeframe]);

  const fetchPrice = useCallback(async () => {
    try {
      const res = await fetch("/api/upbit/price");
      if (!res.ok) throw new Error("Price fetch failed");
      const data = await res.json();
      const price = data.bitcoin?.krw ?? 0;
      const change = data.bitcoin?.krw_24h_change ?? null;
      setCurrentPrice(price);
      setChange24h(change != null ? price - price / (1 + change / 100) : 0);
      setChange24hPercent(change ?? 0);
      setKrwInput(
        price.toLocaleString("ko-KR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
      setLastUpdate(new Date());
    } catch {
      setError("가격을 불러올 수 없습니다.");
    }
  }, []);

  const fetchChart = useCallback(async () => {
    try {
      setError(null);
      const daysParam = getDaysParam();
      const res = await fetch(
        `/api/upbit/candles?days=${encodeURIComponent(daysParam)}`
      );
      if (!res.ok) throw new Error("Chart fetch failed");
      const data = await res.json();
      if (data.error || !data.prices) {
        throw new Error(data.error ?? "Invalid response");
      }
      const raw = data.prices as [number, number][];
      const is1Day = daysParam === "1";
      const step = Math.max(1, Math.floor(raw.length / (is1Day ? 48 : 80)));
      const points: ChartPoint[] = raw
        .filter((_, i) => i % step === 0)
        .map(([ts, value]) => ({
          ts,
          value,
          label: formatKrPrice(value),
          timeLabel:
            is1Day || (daysParam !== "max" && Number(daysParam) <= 5)
              ? new Date(ts).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
              : new Date(ts).toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                }),
        }));
      if (points.length > 0) {
        const lastPrice = raw[raw.length - 1][1];
        points[points.length - 1].value = lastPrice;
        points[points.length - 1].label = formatKrPrice(lastPrice);
        setCurrentPrice((prev) => {
          if (prev === 0) setError(null);
          return prev === 0 ? lastPrice : prev;
        });
        setKrwInput((prev) =>
          prev === ""
            ? lastPrice.toLocaleString("ko-KR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : prev
        );
        setLastUpdate(new Date());
      }
      setChartData(points);
    } catch {
      setError("차트 데이터를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, [getDaysParam]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  useEffect(() => {
    setLoading(true);
    fetchChart();
  }, [fetchChart, timeframe]);

  const handleKrwChange = (val: string) => {
    const num = parseFloat(val.replace(/,/g, "")) || 0;
    setKrwInput(val);
    setBtcInput(currentPrice > 0 ? (num / currentPrice).toFixed(8) : "");
  };

  const handleBtcChange = (val: string) => {
    setBtcInput(val);
    const btc = parseFloat(val.replace(/,/g, "")) || 0;
    setKrwInput((btc * currentPrice).toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current || !svgRef.current || chartData.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 800;
    const padding = { left: 60, right: 20, top: 20, bottom: 40 };
    const chartW = 800 - padding.left - padding.right;
    const idx = Math.round(((x - padding.left) / chartW) * (chartData.length - 1));
    const clamped = Math.max(0, Math.min(idx, chartData.length - 1));
    const p = chartData[clamped];
    setTooltip({
      clientX: e.clientX,
      clientY: e.clientY,
      price: p.value,
      time: p.timeLabel,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "비트코인 시세",
        url: window.location.href,
        text: `비트코인 현재가: ${formatKrPrice(currentPrice)} KRW`,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 클립보드에 복사되었습니다.");
    }
  };

  if (loading && chartData.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (error && chartData.length === 0) {
    return (
      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-8 dark:border-[rgba(255,255,255,0.09)]">
        <p className="text-amber-600 dark:text-amber-400">{error}</p>
        <button
          onClick={() => { setLoading(true); fetchChart(); fetchPrice(); }}
          className="mt-4 flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </button>
      </div>
    );
  }

  const min = chartData.length ? Math.min(...chartData.map((d) => d.value)) : 0;
  const max = chartData.length ? Math.max(...chartData.map((d) => d.value)) : 1;
  const range = max - min || 1;
  const w = 800;
  const h = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const points = chartData
    .map((p, i) => {
      const x = padding.left + (i / (chartData.length - 1 || 1)) * chartW;
      const y = padding.top + chartH - ((p.value - min) / range) * chartH;
      return `${x},${y}`;
    })
    .join(" ");

  const isUp = change24h >= 0;

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-sm text-[#37352f99] dark:text-[#ebebeb99]">
            시장 요약 &gt; 비트코인
          </p>
          <p className="text-2xl font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-3xl">
            {formatKrPrice(currentPrice)} KRW
          </p>
          <p
            className={`mt-1 flex items-center gap-1 text-sm ${
              isUp ? "text-red-500" : "text-blue-500"
            }`}
          >
            {isUp ? "↑" : "↓"} {Math.abs(change24h).toLocaleString("ko-KR", { minimumFractionDigits: 2 })}{" "}
            ({change24hPercent >= 0 ? "+" : ""}
            {change24hPercent.toFixed(2)}%) 오늘
          </p>
          {lastUpdate && (
            <p className="mt-1 text-xs text-[#37352f99] dark:text-[#ebebeb99]">
              {lastUpdate.toLocaleString("ko-KR", {
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              UTC
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-md border border-[rgba(55,53,47,0.2)] px-4 py-2 text-sm text-[#37352f] transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:hover:bg-[rgba(255,255,255,0.04)]"
          >
            <Share2 className="h-4 w-4" />
            공유
          </button>
          <button
            onClick={() => { fetchPrice(); setLoading(true); fetchChart(); }}
            className="flex items-center gap-2 rounded-md border border-[rgba(55,53,47,0.2)] px-4 py-2 text-sm text-[#37352f] transition-colors hover:bg-[rgba(55,53,47,0.04)] dark:border-[rgba(255,255,255,0.2)] dark:text-[#ebebeb] dark:hover:bg-[rgba(255,255,255,0.04)]"
          >
            <RefreshCw className="h-4 w-4" />
            새로고침
          </button>
        </div>
      </div>

      {/* 기간 선택 탭 */}
      <div className="flex flex-wrap gap-1 border-b border-[rgba(55,53,47,0.09)] dark:border-[rgba(255,255,255,0.09)]">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.label}
            type="button"
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              timeframe.label === tf.label
                ? "border-b-2 border-amber-500 text-amber-600 dark:text-amber-400"
                : "text-[#37352f99] hover:text-[#37352f] dark:text-[#ebebeb99] dark:hover:text-[#ebebeb]"
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* 차트 */}
      <div
        ref={chartRef}
        className="relative overflow-hidden rounded-lg border border-[rgba(55,53,47,0.09)] bg-white p-6 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1f1f1f]"
      >
        {error && (
          <p className="mb-4 text-sm text-amber-600 dark:text-amber-400">
            {error}
          </p>
        )}
        <div className="relative overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${w} ${h}`}
            className="min-h-[240px] w-full max-w-full cursor-crosshair"
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {[max, (max + min) / 2, min].map((v, i) => (
              <text
                key={i}
                x={padding.left - 8}
                y={padding.top + (i === 0 ? 0 : i === 1 ? chartH / 2 : chartH) + 4}
                className="fill-[#37352f99] text-xs dark:fill-[#ebebeb99]"
                textAnchor="end"
              >
                {formatEok(v)}
              </text>
            ))}
            <polyline
              points={points}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {chartData
              .filter((_, i) => i % Math.max(1, Math.floor(chartData.length / 5)) === 0)
              .map((p, i) => {
                const idx = chartData.indexOf(p);
                const x = padding.left + (idx / (chartData.length - 1 || 1)) * chartW;
                return (
                  <text
                    key={i}
                    x={x}
                    y={h - 8}
                    className="fill-[#37352f99] text-xs dark:fill-[#ebebeb99]"
                    textAnchor="middle"
                  >
                    {p.timeLabel}
                  </text>
                );
              })}
          </svg>
        </div>
        {tooltip && (
          <div
            className="pointer-events-none fixed z-50 rounded-lg border border-[rgba(55,53,47,0.15)] bg-white px-3 py-2 shadow-lg dark:border-[rgba(255,255,255,0.15)] dark:bg-[#2a2a2a]"
            style={{
              left: tooltip.clientX + 12,
              top: tooltip.clientY - 40,
            }}
          >
            <p className="font-medium text-[#37352f] dark:text-[#ebebeb]">
              {formatKrPrice(tooltip.price)}
            </p>
            <p className="text-xs text-[#37352f99] dark:text-[#ebebeb99]">
              {tooltip.time}
            </p>
          </div>
        )}
      </div>

      {/* 환율 변환기 */}
      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-6 dark:border-[rgba(255,255,255,0.09)]">
        <h3 className="mb-4 text-sm font-semibold text-[#37352f] dark:text-[#ebebeb]">
          환율 변환
        </h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-[rgba(55,53,47,0.15)] bg-white px-4 py-3 dark:border-[rgba(255,255,255,0.15)] dark:bg-[#252525]">
            <input
              type="text"
              inputMode="decimal"
              value={btcInput}
              onChange={(e) => handleBtcChange(e.target.value)}
              className="flex-1 bg-transparent text-[#37352f] focus:outline-none dark:text-[#ebebeb]"
            />
            <span className="shrink-0 text-sm font-medium text-[#37352f99] dark:text-[#ebebeb99]">
              BTC
            </span>
          </div>
          <span className="hidden shrink-0 text-[#37352f66] sm:inline">
            =
          </span>
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-[rgba(55,53,47,0.15)] bg-white px-4 py-3 dark:border-[rgba(255,255,255,0.15)] dark:bg-[#252525]">
            <input
              type="text"
              inputMode="numeric"
              value={krwInput}
              onChange={(e) => handleKrwChange(e.target.value)}
              className="flex-1 bg-transparent text-[#37352f] focus:outline-none dark:text-[#ebebeb]"
            />
            <span className="shrink-0 text-sm font-medium text-[#37352f99] dark:text-[#ebebeb99]">
              KRW
            </span>
          </div>
        </div>
      </div>

      <p className="mt-10 pt-6 text-center text-[10px] text-[#37352f66] dark:text-[#ebebeb66]">
        데이터 출처: Upbit API
      </p>
    </div>
  );
}
