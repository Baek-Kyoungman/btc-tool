# BTC Tools

비트코인 유틸리티 웹앱. AdSense 승인용 품질 콘텐츠 제공.

## 카테고리

| 카테고리 | 경로 | 기능 |
|---------|------|------|
| 사토시 계산기 | `/satoshi-calculator` | BTC ↔ SAT ↔ USD 실시간 변환 |
| 비트코인 시계 | `/bitcoin-clock` | 블록 타임스탬프 시계 |
| 비트코인 반감기 | `/bitcoin-halving` | 다음 반감기 카운트다운 |
| 블로그 | `/blog` | Tiptap 에디터, Supabase 연동 예정 |

## 기술 스택

- **Next.js 16** (App Router)
- **shadcn/ui** + **Material UI**
- **Tiptap** (리치 텍스트 에디터)
- **Tailwind CSS** + **@tailwindcss/typography**
- **Supabase** (예정)

## 디자인

Notion 스타일: 미니멀, 넓은 여백, 중립 컬러

## 실행

```bash
npm install
npm run dev
```

## API 가이드

`docs/API_GUIDE.md` 참고

- **사토시 계산기**: CoinGecko API
- **비트코인 시계/반감기**: Blockchain.info, Mempool.space
- **블로그**: Supabase

## 다음 단계

1. Supabase 프로젝트 생성 후 `.env.local` 설정
2. 각 카테고리별 API 연동 및 UI 구현
3. 블로그 CRUD 및 Tiptap 에디터 연동
