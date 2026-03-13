import { NextResponse } from "next/server";

const MAX_DAYS = 36500; // 100년
const PER_REQUEST = 200;

interface UpbitCandle {
  candle_date_time_utc: string;
  trade_price: number;
}

function toPrices(raw: UpbitCandle[]): [number, number][] {
  return raw
    .map((c) => {
      const ts = new Date(c.candle_date_time_utc + "Z").getTime();
      return [ts, c.trade_price] as [number, number];
    })
    .reverse();
}

/** Upbit KRW-BTC 캔들 → CoinGecko 호환 { prices: [[ts, price], ...] } */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let daysParam = searchParams.get("days") ?? "7";

  if (daysParam === "max") daysParam = String(MAX_DAYS);
  else if (daysParam === "ytd") {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    daysParam = String(
      Math.min(Math.ceil((now.getTime() - start.getTime()) / 86400000), MAX_DAYS)
    );
  } else if (Number(daysParam) > MAX_DAYS) daysParam = String(MAX_DAYS);

  const days = Math.min(Number(daysParam) || 7, MAX_DAYS);

  try {
    const is1Day = days <= 1;
    if (is1Day) {
      const res = await fetch(
        "https://api.upbit.com/v1/candles/minutes/60?market=KRW-BTC&count=24",
        { next: { revalidate: 60 } }
      );
      if (!res.ok) {
        return NextResponse.json(
          { error: `Upbit API error: ${res.status}` },
          { status: res.status }
        );
      }
      const raw: UpbitCandle[] = await res.json();
      if (!Array.isArray(raw) || raw.length === 0) {
        return NextResponse.json({ error: "No candle data" }, { status: 502 });
      }
      return NextResponse.json({ prices: toPrices(raw) });
    }

    const allPrices: [number, number][] = [];
    let to: string | null = null;
    let remaining = days;
    const maxRequests = Math.ceil(MAX_DAYS / PER_REQUEST);

    for (let i = 0; i < maxRequests && remaining > 0; i++) {
      const count = Math.min(PER_REQUEST, remaining);
      let url = `https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=${count}`;
      if (to) url += `&to=${encodeURIComponent(to)}`;

      const res = await fetch(url, { next: { revalidate: 60 } });
      if (!res.ok) {
        return NextResponse.json(
          { error: `Upbit API error: ${res.status}` },
          { status: res.status }
        );
      }
      const raw: UpbitCandle[] = await res.json();
      if (!Array.isArray(raw) || raw.length === 0) break;

      const batch = toPrices(raw);
      allPrices.push(...batch);
      remaining -= raw.length;
      if (raw.length < count) break;

      const oldest = raw[raw.length - 1];
      to = oldest.candle_date_time_utc;
    }

    const prices = allPrices.sort((a, b) => a[0] - b[0]);
    return NextResponse.json({ prices });
  } catch (err) {
    console.error("Upbit candles error:", err);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
