"use client";

import Link from "next/link";

const categories = [
  "سيارات جديدة",
  "سيارات مستعملة",
  "دراجات نارية",
  "شاحنات",
  "قوارب ويخوت",
  "لوحات أرقام",
  "إكسسوارات",
  "مركبات للتصدير",
];

const services = [
  { title: "ابحث عن مركبتك", description: "بحث ذكي حسب السعر، النوع، الاستخدام والموقع." },
  { title: "اعرض مركبتك", description: "أضف الصور والمعلومات وسيكمل عزم التفاصيل." },
  { title: "تقييم ذكي", description: "تقدير أولي للسعر بناءً على السوق والمواصفات." },
  { title: "تمويل وتأمين", description: "مقارنة عروض مناسبة من شركاء المنصة." },
];

export default function HomePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-2xl font-black">عزم</div>
            <div className="text-xs text-slate-500">AVOS Vehicle Operating System</div>
          </div>
          <nav className="hidden gap-6 text-sm font-semibold md:flex">
            <Link href="/vehicles">المركبات</Link>
            <Link href="/sell">بيع مركبتك</Link>
            <Link href="/services">الخدمات</Link>
            <Link href="/dashboard">لوحتي</Link>
          </nav>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-slate-100">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
              منصة المركبات الذكية للإمارات
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              كل عالم المركبات
              <span className="block text-emerald-600">في مكان واحد</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              ابحث، قارن، قيّم، موّل، أمّن، اشحن أو بع مركبتك بمساعدة عزم الذكية.
            </p>

            <div className="mt-8 rounded-3xl border bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  className="flex-1 rounded-2xl border px-5 py-4 outline-none"
                  placeholder="شو في خاطرك اليوم؟ مثال: لاندكروزر 2024 أقل من 250 ألف"
                />
                <button className="rounded-2xl bg-emerald-600 px-7 py-4 font-bold text-white">
                  ابحث مع عزم
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border bg-white p-6 shadow-xl">
            <div className="rounded-3xl bg-slate-900 p-6 text-white">
              <div className="text-sm text-slate-300">مساعدك الذكي</div>
              <div className="mt-2 text-3xl font-black">مرحبا الساع 👋</div>
              <p className="mt-3 text-slate-300">
                قل لي ميزانيتك ونوع المركبة وأنا أرتب لك أفضل الخيارات.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <button className="rounded-2xl bg-white/10 p-4">أريد سيارة عائلية</button>
                <button className="rounded-2xl bg-white/10 p-4">قيّم سيارتي</button>
                <button className="rounded-2xl bg-white/10 p-4">سيارة للتصدير</button>
                <button className="rounded-2xl bg-white/10 p-4">تمويل وتأمين</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-3xl font-black">تصفح حسب الفئة</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category}
              href="/vehicles"
              className="rounded-3xl border bg-white p-5 font-bold shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-black">الخدمات السريعة</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article key={service.title} className="rounded-3xl border p-6">
                <h3 className="text-xl font-black">{service.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}