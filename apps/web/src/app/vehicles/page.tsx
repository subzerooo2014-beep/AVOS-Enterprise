import { SiteHeader } from "../components/site-header";
import { VehicleCard } from "../components/vehicle-card";

const vehicles = [
  { id: "land-cruiser-2024", title: "Toyota Land Cruiser 2024", price: "AED 289,000", location: "دبي", year: 2024, mileage: "12,000 كم", trust: 96, badge: "موثوق" },
  { id: "patrol-2023", title: "Nissan Patrol 2023", price: "AED 245,000", location: "أبوظبي", year: 2023, mileage: "28,000 كم", trust: 93 },
  { id: "gle-2024", title: "Mercedes GLE 2024", price: "AED 319,000", location: "الشارقة", year: 2024, mileage: "9,000 كم", trust: 91 },
  { id: "model-y-2024", title: "Tesla Model Y 2024", price: "AED 179,000", location: "دبي", year: 2024, mileage: "6,000 كم", trust: 94 },
  { id: "bmw-x5-2023", title: "BMW X5 2023", price: "AED 275,000", location: "دبي", year: 2023, mileage: "20,000 كم", trust: 90 },
  { id: "lexus-lx-2024", title: "Lexus LX 2024", price: "AED 455,000", location: "أبوظبي", year: 2024, mileage: "4,500 كم", trust: 97, badge: "Premium" },
];

export default function VehiclesPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-black">سوق المركبات</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">الفلاتر</h2>
            <div className="mt-5 grid gap-4">
              <select className="rounded-2xl border px-4 py-3"><option>كل الفئات</option></select>
              <select className="rounded-2xl border px-4 py-3"><option>كل الإمارات</option></select>
              <input className="rounded-2xl border px-4 py-3" placeholder="السعر من" />
              <input className="rounded-2xl border px-4 py-3" placeholder="السعر إلى" />
              <select className="rounded-2xl border px-4 py-3"><option>السنة</option></select>
              <button className="rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white">تطبيق الفلاتر</button>
            </div>
          </aside>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => <VehicleCard key={vehicle.id} {...vehicle} />)}
          </section>
        </div>
      </div>
    </main>
  );
}