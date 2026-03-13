import { NextResponse } from "next/server";

/** CoinMarketCap Crypto Fear & Greed Index */
export async function GET() {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "COINMARKETCAP_API_KEY가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      "https://pro-api.coinmarketcap.com/v3/fear-and-greed/historical?limit=1",
      {
        next: { revalidate: 3600 },
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `CoinMarketCap API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const item = data?.data?.[0];
    if (!item) {
      return NextResponse.json({ error: "No data" }, { status: 502 });
    }

    return NextResponse.json({
      value: typeof item.value === "number" ? item.value : parseInt(String(item.value ?? "0"), 10),
      classification: item.value_classification ?? item.valueClassification ?? "",
      timestamp: item.timestamp ?? null,
    });
  } catch (err) {
    console.error("Fear & Greed API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch Fear & Greed data" },
      { status: 500 }
    );
  }
}
