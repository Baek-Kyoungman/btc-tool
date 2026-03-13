# Supabase Storage (이미지 업로드) 설정

블로그 썸네일 및 본문 이미지 업로드를 위해 Storage 버킷을 생성하세요.

## 방법 1: 대시보드에서 생성 (권장)

1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴 **Storage** 클릭
4. **New bucket** 버튼 클릭
5. 설정:
   - **Name**: `blog-images`
   - **Public bucket**: ✅ 체크 (업로드한 이미지를 외부 URL로 접근 가능하게)
6. **Create bucket** 클릭

## 방법 2: SQL Editor에서 생성

1. Supabase 대시보드 > **SQL Editor**
2. 아래 SQL 실행:

```sql
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;
```
