-- Supabase SQL Editor에서 실행하세요.
-- 블로그 게시글 테이블 생성

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null default '',
  thumbnail text,
  published_at timestamptz not null default now(),
  likes int not null default 0,
  views int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- slug로 검색용 인덱스
create index if not exists posts_slug_idx on public.posts (slug);
create index if not exists posts_published_at_idx on public.posts (published_at desc);

-- RLS: 누구나 조회 가능, 수정/삭제는 service_role로만 (Server Action에서 처리)
alter table public.posts enable row level security;

create policy "누구나 게시글 조회 가능"
  on public.posts for select
  using (true);

-- Storage: 블로그 이미지 버킷
-- Supabase 대시보드 > Storage > New bucket 에서 수동 생성 권장:
--   - Name: blog-images
--   - Public bucket: 체크
-- SQL로 생성하려면 아래 실행:
-- insert into storage.buckets (id, name, public)
-- values ('blog-images', 'blog-images', true)
-- on conflict (id) do nothing;
