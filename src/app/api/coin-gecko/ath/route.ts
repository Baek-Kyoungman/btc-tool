import { NextResponse } from "next/server";

/** CoinGecko Bitcoin ATH (All-Time High) - KRW 기준 */
export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false",
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `CoinGecko API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const md = data?.market_data;
    if (!md?.current_price?.krw || !md?.ath?.krw) {
      return NextResponse.json(
        { error: "Invalid CoinGecko response" },
        { status: 502 }
      );
    }

    const currentPrice = md.current_price.krw;
    const athPrice = md.ath.krw;
    const athChangePercent = md.ath_change_percentage?.krw ?? null;
    const athDate = md.ath_date?.krw ?? null;

    return NextResponse.json({
      currentPrice,
      athPrice,
      athChangePercent,
      athDate,
    });
  } catch (err) {
    console.error("CoinGecko ATH error:", err);
    return NextResponse.json(
      { error: "Failed to fetch ATH data" },
      { status: 500 }
    );
  }
}
