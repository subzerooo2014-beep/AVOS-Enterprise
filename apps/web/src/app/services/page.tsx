export default function ServicesPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black">خدمات AVOS</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            "التقييم الذكي",
            "الفحص",
            "التمويل",
            "التأمين",
            "الشحن والتصدير",
            "المزادات",
          ].map((item) => (
            <div key={item} className="rounded-3xl border bg-white p-7 shadow-sm">
              <h2 className="text-xl font-black">{item}</h2>
              <p className="mt-3 text-slate-600">خدمة متكاملة داخل منصة عزم.</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}