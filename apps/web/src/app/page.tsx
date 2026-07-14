import Link from "next/link";
import { AzmAssistant } from "./components/azm-assistant";
import { SiteHeader } from "./components/site-header";
import { VehicleCard } from "./components/vehicle-card";

const featuredVehicles = [
  { id: "land-cruiser-2024", title: "Toyota Land Cruiser 2024", price: "AED 289,000", location: "دبي", year: 2024, mileage: "12,000 كم", trust: 96, badge: "موثوق" },
  { id: "patrol-2023", title: "Nissan Patrol 2023", price: "AED 245,000", location: "أبوظبي", year: 2023, mileage: "28,000 كم", trust: 93, badge: "مميز" },
  { id: "gle-2024", title: "Mercedes GLE 2024", price: "AED 319,000", location: "الشارقة", year: 2024, mileage: "9,000 كم", trust: 91 },
];

export default function HomePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="overflow-hidden border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
              المنصة الذكية للمركبات في الإمارات
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              ابحث عن مركبتك
              <span className="block text-emerald-600">بذكاء عزم</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              بيع، شراء، تمويل، تأمين، فحص، شحن وتصدير في تجربة واحدة سهلة.
            </p>

            <div className="mt-8 rounded-3xl border bg-white p-4 shadow-lg">
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <input
                  className="rounded-2xl border px-5 py-4 outline-none"
                  placeholder="ابحث عن سيارة، دراجة، قارب أو لوحة..."
                />
                <Link href="/vehicles" className="rounded-2xl bg-emerald-600 px-7 py-4 text-center font-bold text-white">
                  بحث متقدم
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl">
            <div className="text-sm text-slate-300">اقتراح عزم اليوم</div>
            <h2 className="mt-2 text-3xl font-black">أفضل سيارات عائلية تحت 250 ألف</h2>
            <p className="mt-4 leading-7 text-slate-300">
              مقارنة تلقائية بين السعر، الاعتمادية، التمويل، التأمين ونسبة الثقة.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">96%</div><div className="text-xs">ثقة</div></div>
              <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">18</div><div className="text-xs">خيار</div></div>
              <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-black">4</div><div className="text-xs">عروض تمويل</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black">مركبات مختارة لك</h2>
            <p className="mt-2 text-slate-500">اختيارات ذكية بناءً على السوق والثقة.</p>
          </div>
          <Link href="/vehicles" className="font-bold text-emerald-600">عرض الكل</Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} {...vehicle} />)}
        </div>
      </section>

      <AzmAssistant />
    </main>
  );
}