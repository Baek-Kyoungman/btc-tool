"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronsUpDown } from "lucide-react";

const SATS_PER_BTC = 100_000_000;
const REFRESH_INTERVAL_MS = 30 * 1000;

interface Prices {
  btcUsd: number;
  btcKrw: number;
  usdKrw: number;
}

interface ExchangePrice {
  krw: number;
  usd: number;
  name: string;
}

export function SatoshiCalculator() {
  const [prices, setPrices] = useState<Prices>({
    btcUsd: 0,
    btcKrw: 0,
    usdKrw: 0,
  });
  const [sats, setSats] = useState("");
  const [krw, setKrw] = useState("");
  const [usd, setUsd] = useState("");
  const [focusedInput, setFocusedInput] = useState<"sats" | "krw" | "usd" | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,krw"
      );
      const data = await res.json();
      const btcUsd = data.bitcoin?.usd ?? 0;
      const btcKrw = data.bitcoin?.krw ?? 0;
      setPrices({
        btcUsd,
        btcKrw,
        usdKrw: btcKrw && btcUsd ? btcKrw / btcUsd : 0,
      });
    } catch {
      setPrices({
        btcUsd: 73000,
        btcKrw: 109000000,
        usdKrw: 1493,
      });
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  useEffect(() => {
    const interval = setInterval(fetchPrices, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const btcPrice = prices.btcUsd || 73000;
  const krwPerBtc = prices.btcKrw || 109000000;
  const usdKrwRate = prices.usdKrw || 1493;

  const exchange1: ExchangePrice = {
    krw: krwPerBtc * 0.981,
    usd: btcPrice * 0.981,
    name: "Upbit",
  };
  const exchange2: ExchangePrice = {
    krw: krwPerBtc,
    usd: btcPrice,
    name: "Binance",
  };
  const diffKrw = exchange1.krw - exchange2.krw;
  const diffUsd = exchange1.usd - exchange2.usd;
  const diffPercent = ((diffKrw / exchange2.krw) * 100).toFixed(2);

  const cardBorder = "border border-[rgba(55,53,47,0.2)] dark:border-[rgba(255,255,255,0.2)]";
  const cardHoverGreen =
    "hover:border-green-500/60 focus:border-green-500/60 transition-colors";

  function isCardHighlighted(id: string) {
    return hoveredCard === id || selectedCard === id;
  }

  function formatWithCommas(value: string): string {
    if (!value) return "";
    const [int, dec] = value.split(".");
    const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return dec !== undefined ? `${formatted}.${dec}` : formatted;
  }

  function updateFromSats(value: string) {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned) || 0;
    const btc = num / SATS_PER_BTC;
    setSats(cleaned);
    setKrw(cleaned ? String(Math.round(btc * krwPerBtc)) : "");
    setUsd(cleaned ? (btc * btcPrice).toFixed(2) : "");
  }

  function updateFromKrw(value: string) {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned) || 0;
    const btc = num / krwPerBtc;
    setKrw(cleaned);
    setSats(cleaned ? String(Math.round(btc * SATS_PER_BTC)) : "");
    setUsd(cleaned ? (btc * btcPrice).toFixed(2) : "");
  }

  function updateFromUsd(value: string) {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned) || 0;
    const btc = num / btcPrice;
    setUsd(cleaned);
    setSats(cleaned ? String(Math.round(btc * SATS_PER_BTC)) : "");
    setKrw(cleaned ? String(Math.round(btc * krwPerBtc)) : "");
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-[2rem] font-bold text-[#37352f] dark:text-[#ebebeb] sm:text-[2.5rem]">
            사토시 계산기
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-[rgba(55,53,47,0.15)] bg-white px-4 py-2 dark:border-[rgba(255,255,255,0.15)] dark:bg-[#252525]">
            <span className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
              USDKRW
            </span>
            <span className="ml-2 font-semibold text-[#37352f] dark:text-[#ebebeb]">
              ₩ {usdKrwRate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 비교 섹션 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <div
          className={`flex flex-1 cursor-pointer flex-col rounded-xl bg-white p-4 dark:bg-[#252525] ${cardBorder} ${cardHoverGreen} ${isCardHighlighted("upbit") ? "border-green-500/60" : ""}`}
          onMouseEnter={() => setHoveredCard("upbit")}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => setSelectedCard((prev) => (prev === "upbit" ? null : "upbit"))}
          role="button"
        >
          <p className="mb-3 text-sm font-semibold text-[#37352f] dark:text-[#ebebeb]">
            Upbit
          </p>
          <p className="text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
            ₩ {exchange1.krw.toLocaleString()}
          </p>
          <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
            $ {exchange1.usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="flex items-center justify-center text-[#37352f66] dark:text-[#ebebeb66]">
          -
        </div>
        <div
          className={`flex flex-1 cursor-pointer flex-col rounded-xl bg-white p-4 dark:bg-[#252525] ${cardBorder} ${cardHoverGreen} ${isCardHighlighted("binance") ? "border-green-500/60" : ""}`}
          onMouseEnter={() => setHoveredCard("binance")}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() =>
            setSelectedCard((prev) => (prev === "binance" ? null : "binance"))
          }
          role="button"
        >
          <p className="mb-3 text-sm font-semibold text-[#37352f] dark:text-[#ebebeb]">
            Binance
          </p>
          <p className="text-lg font-semibold text-[#37352f] dark:text-[#ebebeb]">
            ₩ {exchange2.krw.toLocaleString()}
          </p>
          <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
            $ {exchange2.usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="flex items-center justify-center text-[#37352f66] dark:text-[#ebebeb66]">
          =
        </div>
        <div
          className={`flex flex-1 flex-col rounded-xl bg-white p-4 dark:bg-[#252525] ${cardBorder}`}
        >
          <p className="mb-1 text-sm font-medium text-red-500">
            KR {diffPercent}%
          </p>
          <p className="text-lg font-semibold text-red-500">
            ₩ {diffKrw.toLocaleString()}
          </p>
          <p className="text-sm text-red-500/80">
            $ {diffUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* 계산기 */}
      <div className="space-y-4">
        <p className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
          * 어느 값을 수정하든 다른 값들이 자동으로 계산됩니다.
        </p>
        <div className="rounded-2xl border border-[rgba(55,53,47,0.09)] bg-white p-6 dark:border-[rgba(255,255,255,0.09)] dark:bg-[#1f1f1f]">
          {/* SATS */}
          <div className="border-b border-[rgba(55,53,47,0.09)] py-4 last:border-0 dark:border-[rgba(255,255,255,0.09)]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  ₿
                </span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={formatWithCommas(sats)}
                onChange={(e) => updateFromSats(e.target.value.replace(/,/g, ""))}
                onFocus={() => setFocusedInput("sats")}
                placeholder="0"
                className="flex-1 bg-transparent py-2 text-right text-lg font-medium text-[#37352f] focus:outline-none dark:text-[#ebebeb]"
              />
              <span className="w-12 shrink-0 text-right text-sm text-[#37352f99] dark:text-[#ebebeb99]">
                SATS
              </span>
            </div>
            <p className="mt-1 pl-12 text-sm text-[#37352f99] dark:text-[#ebebeb99]">
              {sats
                ? formatWithCommas((parseFloat(sats) / SATS_PER_BTC).toFixed(8))
                : "0.00000000"}{" "}
              BTC
            </p>
          </div>

          {/* KRW */}
          <div className="border-b border-[rgba(55,53,47,0.09)] py-4 last:border-0 dark:border-[rgba(255,255,255,0.09)]">
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium text-[#37352f] dark:text-[#ebebeb]">
                ₩
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={formatWithCommas(krw)}
                onChange={(e) => updateFromKrw(e.target.value.replace(/,/g, ""))}
                onFocus={() => setFocusedInput("krw")}
                placeholder="0"
                className={`flex-1 bg-transparent py-2 text-right text-lg font-medium text-[#37352f] focus:outline-none dark:text-[#ebebeb] ${
                  focusedInput === "krw" ? "ring-2 ring-amber-500/50 rounded" : ""
                }`}
              />
              <div className="flex w-12 shrink-0 items-center justify-end gap-0.5">
                <ChevronsUpDown className="h-4 w-4 text-[#37352f99] dark:text-[#ebebeb99]" />
                <span className="text-sm text-[#37352f99] dark:text-[#ebebeb99]">
                  KRW
                </span>
              </div>
            </div>
            <p className="mt-1 pl-12 text-sm text-[#37352f99] dark:text-[#ebebeb99]">
              {krw ? parseInt(krw || "0").toLocaleString() : "0"} KRW
            </p>
          </div>

          {/* USD */}
          <div className="py-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium text-[#37352f] dark:text-[#ebebeb]">
                $
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={formatWithCommas(usd)}
                onChange={(e) => updateFromUsd(e.target.value.replace(/,/g, ""))}
                onFocus={() => setFocusedInput("usd")}
                placeholder="0"
                className="flex-1 bg-transparent py-2 text-right text-lg font-medium text-[#37352f] focus:outline-none dark:text-[#ebebeb]"
              />
              <span className="w-12 shrink-0 text-right text-sm text-[#37352f99] dark:text-[#ebebeb99]">
                USD
              </span>
            </div>
            <p className="mt-1 pl-12 text-sm text-[#37352f99] dark:text-[#ebebeb99]">
              {usd
                ? parseFloat(usd).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })
                : "0"}{" "}
              USD
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
