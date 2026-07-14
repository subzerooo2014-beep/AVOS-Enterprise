import { SiteHeader } from "../components/site-header";

export default function InsurancePage() {
  const offers = [
    ["AVOS Insurance", "AED 5,900", "شامل"],
    ["Emirates Cover", "AED 6,250", "شامل"],
    ["Gulf Shield", "AED 5,650", "طرف ثالث+"],
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-black">مقارنة التأمين</h1>
        <p className="mt-2 text-slate-500">قارن العروض واختر الأنسب لك.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {offers.map(([provider, price, coverage]) => (
            <article key={provider} className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">{provider}</h2>
              <div className="mt-3 text-3xl font-black text-emerald-600">{price}</div>
              <div className="mt-2 text-sm text-slate-500">{coverage}</div>
              <button className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white">
                اطلب العرض
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}