import { NextResponse } from "next/server";

const SAT_PER_BTC = 100_000_000;
const MAX_SUPPLY_BTC = 21_000_000;

/** Blockchain.info - 비트코인 총 유통 공급량 (사토시 단위) */
export async function GET() {
  try {
    const res = await fetch("https://blockchain.info/q/totalbc", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Blockchain API error: ${res.status}` },
        { status: res.status }
      );
    }

    const totalSat = parseInt(await res.text(), 10);
    if (isNaN(totalSat)) {
      return NextResponse.json({ error: "Invalid response" }, { status: 502 });
    }

    const circulatingBtc = totalSat / SAT_PER_BTC;
    const percentMined = (circulatingBtc / MAX_SUPPLY_BTC) * 100;
    const remainingBtc = MAX_SUPPLY_BTC - circulatingBtc;

    return NextResponse.json({
      circulating: circulatingBtc,
      max: MAX_SUPPLY_BTC,
      remaining: remainingBtc,
      percentMined,
    });
  } catch (err) {
    console.error("Bitcoin supply API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch supply data" },
      { status: 500 }
    );
  }
}
