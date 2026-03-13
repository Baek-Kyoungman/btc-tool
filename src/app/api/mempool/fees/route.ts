import { NextResponse } from "next/server";

/** Mempool.space 비트코인 수수료 추천 */
export async function GET() {
  try {
    const res = await fetch("https://mempool.space/api/v1/fees/recommended", {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Mempool API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      fastestFee: data.fastestFee ?? 0,
      halfHourFee: data.halfHourFee ?? 0,
      hourFee: data.hourFee ?? 0,
      economyFee: data.economyFee ?? 0,
      minimumFee: data.minimumFee ?? 0,
    });
  } catch (err) {
    console.error("Mempool fees API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch fee data" },
      { status: 500 }
    );
  }
}
