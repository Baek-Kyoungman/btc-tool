import { NextResponse } from "next/server";

/** Upbit KRW-BTC 현재가 + 24h 변동 (차트용) */
export async function GET() {
  try {
    const res = await fetch(
      "https://api.upbit.com/v1/ticker?markets=KRW-BTC",
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upbit API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const t = Array.isArray(data) ? data[0] : data;
    if (!t?.trade_price) {
      return NextResponse.json({ error: "Invalid Upbit response" }, { status: 502 });
    }

    const krw = t.trade_price;
    const changeRate = t.change_rate ?? 0;
    const krw24hChange = changeRate * 100;

    return NextResponse.json({
      bitcoin: { krw, krw_24h_change: krw24hChange },
    });
  } catch (err) {
    console.error("Upbit price error:", err);
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}
