# API 가이드 - BTC Tools

btc.coinsect.io 참고. 카테고리별 필요한 API 목록입니다.

---

## 1. 사토시 계산기 (Satoshi Calculator)

### 기능
- BTC ↔ SAT ↔ USD 실시간 변환
- 1 BTC = 100,000,000 SAT

### API: CoinGecko (무료)

**비트코인 현재 가격 (USD)**

```
GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd
```

**응답 예시**
```json
{
  "bitcoin": {
    "usd": 97500
  }
}
```

**추가 파라미터 (선택)**
- `include_24hr_change=true` - 24시간 변동률
- `include_market_cap=true` - 시가총액

**무료 한도:** Demo API 가입 시 월 제한 (https://www.coingecko.com/en/api/pricing)

---

## 2. 비트코인 시계 (Bitcoin Clock)

### 기능
- 현재 UTC 시각
- 최근 블록 타임스탬프
- 블록 생성 간격 (약 10분)

### API: Blockchain.info / Mempool.space

**Blockchain.info - 최신 블록 정보**
```
GET https://blockchain.info/latestblock
```

**응답 예시**
```json
{
  "hash": "...",
  "time": 1710300000,
  "block_index": 840000,
  "height": 840000
}
```

**Mempool.space (대안)**
```
GET https://mempool.space/api/blocks/tip/height
GET https://mempool.space/api/v1/blocks/{height}
```

---

## 3. 비트코인 반감기 (Bitcoin Halving)

### 기능
- 다음 반감기까지 남은 블록 수
- 예상 일시 (대략 4년마다)
- 210,000블록마다 보상 절반 (50→25→12.5→6.25→3.125 BTC)

### API

**현재 블록 높이**
```
GET https://blockchain.info/q/getblockcount
```
또는
```
GET https://mempool.space/api/blocks/tip/height
```

**계산 공식**
- 다음 반감기 블록 = `Math.ceil(currentHeight / 210000) * 210000`
- 남은 블록 = `다음 반감기 블록 - 현재 블록`
- 예상 일시 ≈ `남은 블록 × 10분` (평균 블록 시간)

**전용 Halving API (선택)**
```
GET https://api.bitcoinexplorer.org/api/blockchain/next-halving
```

---

## 4. 블로그

### 기능
- CRUD (Supabase 연동)
- Tiptap 리치 텍스트 에디터

### API
- Supabase REST API 또는 Client 사용
- 테이블: `posts` (id, title, content, slug, created_at, updated_at)

---

## 환경 변수 (.env.local)

```env
# CoinGecko (무료 플랜 사용 시 선택)
NEXT_PUBLIC_COINGECKO_API_KEY=your_key

# Supabase (나중에 연동)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

> CoinGecko 무료 Demo API는 API 키 없이도 기본 엔드포인트 사용 가능 (rate limit 있음)
