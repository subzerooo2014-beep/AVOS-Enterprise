import { SiteHeader } from "../components/site-header";

export default function DealerPortalPage() {
  const metrics = [
    ["المخزون", "128"],
    ["العملاء المحتملون", "46"],
    ["المبيعات هذا الشهر", "19"],
    ["نسبة التحويل", "18%"],
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">بوابة التاجر</h1>
            <p className="mt-2 text-slate-500">إدارة المخزون، العملاء، العروض والمبيعات.</p>
          </div>
          <button className="rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white">
            إضافة مركبة
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {metrics.map(([label, value]) => (
            <div key={label} className="rounded-3xl border bg-white p-6">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-2 text-3xl font-black">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border bg-white p-7">
          <h2 className="text-2xl font-black">أداء المخزون</h2>
          <div className="mt-5 h-72 rounded-2xl bg-gradient-to-t from-emerald-100 to-slate-50" />
        </div>
      </div>
    </main>
  );
}