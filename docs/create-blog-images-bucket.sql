-- Supabase SQL Editor에서 실행하세요.
-- blog-images Storage 버킷 생성 (블로그 이미지 업로드용)

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;
