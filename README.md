# BTC Tools

비트코인 관련 유틸리티 웹 서비스. 가격 차트, 사토시 계산기, mempool 수수료 등 실시간 데이터를 제공합니다.

## 카테고리

| 카테고리 | 경로 | 설명 |
|---------|------|------|
| 비트코인 최고가 대비 가격 | `/bitcoin-ath` | ATH 대비 현재가 퍼센트, 진행률 |
| 비트코인 차트 | `/bitcoin-chart` | Upbit KRW-BTC 가격 차트, 환율 변환 |
| 비트코인 공포·탐욕 지수 | `/bitcoin-fear-greed` | 시장 심리 지표 (0–100) |
| 비트코인 공급량 | `/bitcoin-supply` | 유통·미채굴 공급량, 진행률 |
| 사토시 계산기 | `/satoshi-calculator` | SAT ↔ KRW ↔ USD 실시간 변환 |
| 비트코인 시계 | `/bitcoin-clock` | UTC 시계, 최신 블록 타임스탬프 |
| 비트코인 반감기 | `/bitcoin-halving` | 5차 반감기 카운트다운 |
| mempool 수수료 | `/mempool-fees` | sat/vB 권장 수수료 |
| 블로그 | `/blog` | Tiptap 에디터, Supabase 연동 |

## 기술 스택

- **Next.js 16** (App Router)
- **React 19**, **TypeScript**
- **Tailwind CSS**, **shadcn/ui**, **Material UI**
- **Tiptap** (리치 텍스트 에디터)
- **Supabase** (블로그 데이터)
- **next-themes** (다크 모드)

## 실행

```bash
npm install
cp .env.example .env.local   # 환경 변수 설정
npm run dev
```

`http://localhost:3000` 에서 확인

## 환경 변수

| 변수 | 용도 | 필수 |
|------|------|------|
| `COINMARKETCAP_API_KEY` | 공포·탐욕 지수 | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 블로그용 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | 블로그용 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role | 블로그용 |
| `BLOG_ADMIN_SECRET` | 블로그 글쓰기 비밀번호 | 블로그용 |

## API 출처 (데이터 소스)

| 카테고리 | API |
|---------|-----|
| 비트코인 최고가 대비 가격 | CoinGecko |
| 비트코인 차트 | Upbit |
| 비트코인 공포·탐욕 지수 | CoinMarketCap |
| 비트코인 공급량 | Blockchain.info |
| 사토시 계산기 | Upbit, Binance |
| 비트코인 시계 | Blockstream.info |
| 비트코인 반감기 | Blockstream.info |
| mempool 수수료 | mempool.space |

## 디자인

- Notion 스타일 레이아웃 (미니멀, 넓은 여백)
- 다크 모드 지원
- 반응형 사이드바 (접기/펼치기)

## 라이선스

Private
