import { NextResponse } from "next/server";

const MAX_DAYS = 36500;
const PER_REQUEST = 200;

interface UpbitCandle {
  candle_date_time_utc: string;
  trade_price: number;
}

/** Upbit KRW-BTC 현재가 + ATH (캔들 최대가 기준) */
export async function GET() {
  try {
    const [priceRes, candlesRes] = await Promise.all([
      fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC", {
        cache: "no-store",
      }),
      fetchCandlesMax(),
    ]);

    if (!priceRes.ok) {
      return NextResponse.json(
        { error: `Upbit API error: ${priceRes.status}` },
        { status: priceRes.status }
      );
    }

    const priceData = await priceRes.json();
    const t = Array.isArray(priceData) ? priceData[0] : priceData;
    const currentPrice = t?.trade_price ?? 0;

    if (!currentPrice) {
      return NextResponse.json(
        { error: "Invalid Upbit price response" },
        { status: 502 }
      );
    }

    const { athPrice, athDate } = candlesRes;

    const athChangePercent =
      athPrice > 0 ? ((currentPrice - athPrice) / athPrice) * 100 : 0;

    return NextResponse.json({
      currentPrice,
      athPrice,
      athChangePercent,
      athDate,
    });
  } catch (err) {
    console.error("Upbit ATH error:", err);
    return NextResponse.json(
      { error: "Failed to fetch ATH data" },
      { status: 500 }
    );
  }
}

async function fetchCandlesMax(): Promise<{
  athPrice: number;
  athDate: string | null;
}> {
  const allPrices: { ts: number; price: number }[] = [];
  let to: string | null = null;
  let remaining = MAX_DAYS;
  const maxRequests = Math.ceil(MAX_DAYS / PER_REQUEST);

  for (let i = 0; i < maxRequests && remaining > 0; i++) {
    const count = Math.min(PER_REQUEST, remaining);
    let url = `https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=${count}`;
    if (to) url += `&to=${encodeURIComponent(to)}`;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Upbit candles: ${res.status}`);

    const raw: UpbitCandle[] = await res.json();
    if (!Array.isArray(raw) || raw.length === 0) break;

    for (const c of raw) {
      const ts = new Date(c.candle_date_time_utc + "Z").getTime();
      allPrices.push({ ts, price: c.trade_price });
    }
    remaining -= raw.length;
    if (raw.length < count) break;

    const oldest = raw[raw.length - 1];
    to = oldest.candle_date_time_utc;
  }

  if (allPrices.length === 0) {
    return { athPrice: 0, athDate: null };
  }

  const ath = allPrices.reduce((max, p) =>
    p.price > max.price ? p : max
  );

  return {
    athPrice: ath.price,
    athDate: new Date(ath.ts).toISOString(),
  };
}
