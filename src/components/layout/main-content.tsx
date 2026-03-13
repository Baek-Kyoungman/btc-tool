export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex-1 pl-64">
      <div className="mx-auto max-w-[900px] px-12 py-16">
        {children}
      </div>
    </main>
  );
}
