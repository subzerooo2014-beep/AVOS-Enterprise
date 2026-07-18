import Link from "next/link";
import { ReviewCard } from "../../components/review-card";
import { SiteHeader } from "../../components/site-header";
import { TrustBadge } from "../../components/trust-badge";

export default function VehicleDetailsPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <section>
            <div className="grid gap-3">
              <div className="h-[430px] rounded-3xl bg-gradient-to-br from-slate-300 to-slate-200" />
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-24 rounded-2xl bg-slate-200" />
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-3xl border bg-white p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-black">تفاصيل المركبة</h2>
                <TrustBadge score={96} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  ["السنة", "2024"],
                  ["الممشى", "12,000 كم"],
                  ["المحرك", "V6 Twin Turbo"],
                  ["اللون", "أبيض لؤلؤي"],
                  ["الحالة", "ممتازة"],
                  ["الضمان", "متوفر"],
                  ["الملكية", "مالك أول"],
                  ["الموقع", "دبي"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="mt-1 font-black">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-black">آراء المستخدمين</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ReviewCard name="أحمد" rating={5} comment="الإعلان واضح والتواصل كان سريعاً." />
                <ReviewCard name="سالم" rating={4} comment="المركبة مطابقة للوصف ونسبة الثقة مفيدة." />
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border bg-white p-7 shadow-sm">
            <div className="text-sm text-slate-500">Toyota Land Cruiser 2024</div>
            <h1 className="mt-2 text-4xl font-black">AED 289,000</h1>

            <div className="mt-5 rounded-2xl bg-emerald-50 p-5">
              <div className="text-sm text-emerald-700">تقييم السعر الذكي</div>
              <div className="mt-1 text-2xl font-black text-emerald-700">سعر عادل</div>
              <div className="mt-2 text-sm text-emerald-700">ضمن متوسط السوق بنسبة 3%</div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link href="/messages" className="rounded-2xl bg-emerald-600 px-5 py-4 text-center font-bold text-white">
                تواصل مع البائع
              </Link>
              <Link href="/finance" className="rounded-2xl border px-5 py-4 text-center font-bold">
                احسب التمويل والتأمين
              </Link>
              <button className="rounded-2xl border px-5 py-4 font-bold">♡ إضافة للمفضلة</button>
              <button className="rounded-2xl border px-5 py-4 font-bold">مشاركة الإعلان</button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}