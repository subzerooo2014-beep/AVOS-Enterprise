import Link from "next/link";
import { AzmOrb } from "../design-system/azm-orb";
import { AvosButton } from "../design-system/avos-button";
import { AvosCard } from "../design-system/avos-card";
import { VehicleShowcase } from "../design-system/vehicle-showcase";

const quickActions = [
  ["شراء", "ابحث بذكاء"],
  ["بيع", "اعرض مركبتك"],
  ["مزاد", "ادخل المزادات"],
  ["تفاوض", "دع عزم يتفاوض"],
];

const insightCards = [
  ["فرصة اليوم", "لاندكروزر 2024 بسعر أقل من السوق 6%"],
  ["أنصح بها", "خيار عائلي موثوق بنسبة 96%"],
  ["تنبيه ذكي", "انخفاض أسعار بعض الفئات هذا الأسبوع"],
];

export default function HomePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#FAF8F2] text-[#10231F]">
      <header className="border-b border-emerald-900/5 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-3xl font-black text-emerald-800">عزم</div>
            <div className="text-xs font-bold text-slate-500">AVOS Vehicle Operating System</div>
          </div>

          <nav className="hidden gap-6 text-sm font-black lg:flex">
            <Link href="/vehicles">المركبات</Link>
            <Link href="/auction">المزادات</Link>
            <Link href="/finance">التمويل</Link>
            <Link href="/insurance">التأمين</Link>
            <Link href="/profile">حسابي</Link>
          </nav>

          <Link
            href="/sell"
            className="rounded-2xl bg-emerald-700 px-5 py-3 font-black text-white"
          >
            أضف إعلانك
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,143,116,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(201,162,39,0.10),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="text-center lg:text-right">
            <span className="rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-sm font-black text-emerald-800">
              تجربة سيارات ذكية بمستوى فاخر
            </span>
            <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
              مرحبا الساع
              <span className="block text-emerald-700">شو في خاطرك اليوم؟</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600 lg:mx-0">
              عزم يفهم احتياجك، يبحث، يقارن، يتفاوض ويقترح أفضل قرار.
            </p>

            <div className="mx-auto mt-8 max-w-2xl rounded-[28px] border border-white/80 bg-white/80 p-4 shadow-xl backdrop-blur lg:mx-0">
              <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
                <input
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-4 outline-none"
                  placeholder="اكتب: أريد SUV عائلية أقل من 250 ألف"
                />
                <AvosButton>⌨️ اكتب</AvosButton>
                <AvosButton variant="secondary">🎤 تحدث</AvosButton>
                <AvosButton variant="glass">📷 صورة</AvosButton>
              </div>
            </div>
          </div>

          <div>
            <AzmOrb />
            <div className="mt-8">
              <VehicleShowcase />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          {quickActions.map(([title, subtitle]) => (
            <AvosCard key={title}>
              <div className="text-2xl font-black">{title}</div>
              <div className="mt-2 text-sm text-slate-500">{subtitle}</div>
            </AvosCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 lg:grid-cols-3">
          {insightCards.map(([title, description]) => (
            <AvosCard key={title}>
              <div className="text-sm font-black text-emerald-700">{title}</div>
              <div className="mt-3 text-xl font-black">{description}</div>
            </AvosCard>
          ))}
        </div>
      </section>
    </main>
  );
}