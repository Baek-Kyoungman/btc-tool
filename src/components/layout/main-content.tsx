export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex-1 pb-16 pt-14 md:pl-64 md:pb-16 md:pt-16">
      <div className="mx-auto max-w-[900px] px-4 py-6 md:px-12 md:py-16">
        {children}
      </div>
    </main>
  );
}
