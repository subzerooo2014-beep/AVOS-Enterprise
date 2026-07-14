import { SiteHeader } from "../components/site-header";

export default function FinancePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-black">التمويل والتأمين</h1>
          <p className="mt-3 text-slate-600">احصل على تقدير أولي ومقارنة عروض مناسبة.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border px-5 py-4" placeholder="سعر المركبة" defaultValue="289000" />
            <input className="rounded-2xl border px-5 py-4" placeholder="الدفعة الأولى" defaultValue="50000" />
            <input className="rounded-2xl border px-5 py-4" placeholder="مدة التمويل بالسنوات" defaultValue="5" />
            <input className="rounded-2xl border px-5 py-4" placeholder="الراتب الشهري" />
          </div>

          <button className="mt-5 w-full rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white">
            احسب أفضل العروض
          </button>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-100 p-5"><div className="text-sm text-slate-500">القسط المتوقع</div><div className="mt-2 text-2xl font-black">AED 4,780</div></div>
            <div className="rounded-2xl bg-slate-100 p-5"><div className="text-sm text-slate-500">التأمين السنوي</div><div className="mt-2 text-2xl font-black">AED 5,900</div></div>
            <div className="rounded-2xl bg-slate-100 p-5"><div className="text-sm text-slate-500">عدد العروض</div><div className="mt-2 text-2xl font-black">4</div></div>
          </div>
        </div>
      </div>
    </main>
  );
}