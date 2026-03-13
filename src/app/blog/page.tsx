export default function BlogPage() {
  return (
    <div className="notion-style">
      <h1 className="mb-2 text-[2.5rem] font-bold text-[#37352f] dark:text-[#ebebeb]">
        블로그
      </h1>
      <p className="mb-12 text-[1rem] leading-7 text-[#37352f99] dark:text-[#ebebeb99]">
        비트코인 관련 아티클 (Tiptap 에디터 사용, Supabase 연동 예정)
      </p>

      <div className="rounded-lg border border-[rgba(55,53,47,0.09)] p-6 dark:border-[rgba(255,255,255,0.09)]">
        <p className="text-[#37352f99] dark:text-[#ebebeb99]">
          블로그 목록 및 Tiptap 에디터 구현 예정
        </p>
      </div>
    </div>
  );
}
