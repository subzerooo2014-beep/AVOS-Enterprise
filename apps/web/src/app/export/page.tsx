import { SiteHeader } from "../components/site-header";

export default function ExportPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-3xl border bg-white p-8">
          <h1 className="text-4xl font-black">التصدير والشحن</h1>
          <p className="mt-3 text-slate-600">اطلب عرض شحن وتتبع مستندات التصدير.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border px-4 py-3" placeholder="الدولة والمدينة" />
            <input className="rounded-2xl border px-4 py-3" placeholder="نوع المركبة" />
            <input className="rounded-2xl border px-4 py-3" placeholder="رقم الهيكل" />
            <input className="rounded-2xl border px-4 py-3" placeholder="ميناء الوصول" />
          </div>

          <button className="mt-5 w-full rounded-2xl bg-emerald-600 px-4 py-4 font-bold text-white">
            احصل على عروض الشحن
          </button>
        </div>
      </div>
    </main>
  );
}