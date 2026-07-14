export default function DashboardPage() {
  const cards = [
    ["إعلاناتي", "4"],
    ["المشاهدات", "1,284"],
    ["الرسائل", "18"],
    ["طلبات الشراء", "7"],
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black">لوحة التحكم</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-2 text-3xl font-black">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}