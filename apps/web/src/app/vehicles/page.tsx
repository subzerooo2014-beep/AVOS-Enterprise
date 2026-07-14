import { MarketplaceFilterBar } from "../components/marketplace-filter-bar";
import { SiteHeader } from "../components/site-header";
import { VehicleCard } from "../components/vehicle-card";

const vehicles = [
  { id: "land-cruiser-2024", title: "Toyota Land Cruiser 2024", price: "AED 289,000", location: "دبي", year: 2024, mileage: "12,000 كم", trust: 96, badge: "موثوق" },
  { id: "patrol-2023", title: "Nissan Patrol 2023", price: "AED 245,000", location: "أبوظبي", year: 2023, mileage: "28,000 كم", trust: 93, badge: "مميز" },
  { id: "gle-2024", title: "Mercedes GLE 2024", price: "AED 319,000", location: "الشارقة", year: 2024, mileage: "9,000 كم", trust: 91 },
  { id: "model-y-2024", title: "Tesla Model Y 2024", price: "AED 179,000", location: "دبي", year: 2024, mileage: "6,000 كم", trust: 94 },
  { id: "bmw-x5-2023", title: "BMW X5 2023", price: "AED 275,000", location: "دبي", year: 2023, mileage: "20,000 كم", trust: 90 },
  { id: "lexus-lx-2024", title: "Lexus LX 2024", price: "AED 455,000", location: "أبوظبي", year: 2024, mileage: "4,500 كم", trust: 97, badge: "Premium" },
];

export default function VehiclesPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black">Marketplace</h1>
            <p className="mt-2 text-slate-500">بحث ذكي، فلاتر متقدمة، ونتائج موثوقة.</p>
          </div>
          <div className="text-sm font-bold text-emerald-600">6 نتائج متاحة</div>
        </div>

        <div className="mt-8">
          <MarketplaceFilterBar />
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} {...vehicle} />
          ))}
        </section>
      </div>
    </main>
  );
}