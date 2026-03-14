-- Supabase SQL Editor에서 실행하세요.
-- posts 테이블에 tags 컬럼 추가

alter table public.posts
add column if not exists tags text;
