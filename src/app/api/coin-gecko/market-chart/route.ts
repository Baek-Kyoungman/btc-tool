import { NextResponse } from "next/server";

const MAX_DAYS_FREE = 365;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let days = searchParams.get("days") ?? "7";

  if (days === "max") days = String(MAX_DAYS_FREE);
  else if (days === "ytd") {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    days = String(Math.min(Math.ceil((now.getTime() - start.getTime()) / 86400000), MAX_DAYS_FREE));
  } else if (Number(days) > MAX_DAYS_FREE) days = String(MAX_DAYS_FREE);

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=krw&days=${days}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `CoinGecko API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("CoinGecko market_chart error:", err);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
