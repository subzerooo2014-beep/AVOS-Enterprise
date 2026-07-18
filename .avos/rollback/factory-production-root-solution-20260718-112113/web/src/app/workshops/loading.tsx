export default function Loading() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-10 w-64 rounded bg-slate-200" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-48 rounded-3xl bg-slate-200" />
          ))}
        </div>
      </div>
    </main>
  );
}