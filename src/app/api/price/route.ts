import { NextResponse } from "next/server";

/** Upbit(KRW) + Binance(USD) → 사토시 계산기용 통합 가격 */
export async function GET() {
  try {
    const [upbitRes, binanceRes] = await Promise.all([
      fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC", {
        cache: "no-store",
      }),
      fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", {
        cache: "no-store",
      }),
    ]);

    if (!upbitRes.ok || !binanceRes.ok) {
      return NextResponse.json(
        { error: "Price API error" },
        { status: 502 }
      );
    }

    const [upbitData, binanceData] = await Promise.all([
      upbitRes.json(),
      binanceRes.json(),
    ]);

    const t = Array.isArray(upbitData) ? upbitData[0] : upbitData;
    const btcKrw = t?.trade_price ?? 0;
    const btcUsd = parseFloat(binanceData?.price ?? "0") || 0;
    const usdKrw = btcKrw && btcUsd ? btcKrw / btcUsd : 0;

    return NextResponse.json({
      btcUsd,
      btcKrw,
      usdKrw,
    });
  } catch (err) {
    console.error("Price API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}
