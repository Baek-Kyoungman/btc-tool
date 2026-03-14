/**
 * SEO 공통 설정
 * NEXT_PUBLIC_SITE_URL이 없으면 빌드/런타임 호스트 기반 URL 사용
 */
export const SITE_NAME = "BTC Tools";
export const SITE_DESCRIPTION =
  "비트코인 사토시 계산기, 실시간 시계, 반감기 카운트다운, 차트, 공급량, 공포탐욕지수 등 비트코인 투자 도구";

export function getSiteUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "https://btc-tools.vercel.app";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
