import { SiteHeader } from "../components/site-header";

export default function WorkshopsPage() {
  const workshops = [
    ["AVOS Certified Workshop", "دبي", "4.9"],
    ["Elite Auto Care", "أبوظبي", "4.8"],
    ["Gulf Motors Service", "الشارقة", "4.7"],
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-black">الورش والصيانة</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {workshops.map(([name, city, rating]) => (
            <article key={name} className="rounded-3xl border bg-white p-6">
              <h2 className="text-xl font-black">{name}</h2>
              <div className="mt-2 text-slate-500">{city}</div>
              <div className="mt-3 font-bold text-amber-500">★ {rating}</div>
              <button className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white">
                احجز موعداً
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}