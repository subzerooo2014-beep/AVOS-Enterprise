import Link from "next/link";
import { SiteHeader } from "../../components/site-header";

export default function VehicleDetailsPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <section>
            <div className="grid gap-3">
              <div className="h-[420px] rounded-3xl bg-slate-300" />
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-24 rounded-2xl bg-slate-200" />
                ))}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border bg-white p-7 shadow-sm">
            <div className="text-sm text-slate-500">
              Toyota Land Cruiser 2024
            </div>

            <h1 className="mt-2 text-4xl font-black">AED 289,000</h1>

            <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
              <div className="text-sm text-emerald-700">نسبة الثقة</div>
              <div className="mt-1 text-3xl font-black text-emerald-700">
                96%
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                href="/messages"
                className="rounded-2xl bg-emerald-600 px-5 py-4 text-center font-bold text-white"
              >
                تواصل مع البائع
              </Link>

              <Link
                href="/finance"
                className="rounded-2xl border px-5 py-4 text-center font-bold"
              >
                احسب التمويل والتأمين
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
