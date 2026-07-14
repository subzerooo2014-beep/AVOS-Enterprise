import { SiteHeader } from "../components/site-header";
import { VehicleCard } from "../components/vehicle-card";

export default function FavoritesPage() {
  const items = [
    { id: "land-cruiser-2024", title: "Toyota Land Cruiser 2024", price: "AED 289,000", location: "دبي", year: 2024, mileage: "12,000 كم", trust: 96 },
    { id: "model-y-2024", title: "Tesla Model Y 2024", price: "AED 179,000", location: "دبي", year: 2024, mileage: "6,000 كم", trust: 94 },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-black">المفضلة</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <VehicleCard key={item.id} {...item} />)}
        </div>
      </div>
    </main>
  );
}