const vehicles = [
  { title: "Toyota Land Cruiser 2024", price: "AED 289,000", trust: 96 },
  { title: "Nissan Patrol 2023", price: "AED 245,000", trust: 93 },
  { title: "Mercedes GLE 2024", price: "AED 319,000", trust: 91 },
  { title: "Tesla Model Y 2024", price: "AED 179,000", trust: 94 },
];

export default function VehiclesPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black">المركبات</h1>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((vehicle) => (
            <article key={vehicle.title} className="overflow-hidden rounded-3xl border bg-white shadow-sm">
              <div className="h-48 bg-slate-200" />
              <div className="p-5">
                <h2 className="font-black">{vehicle.title}</h2>
                <div className="mt-2 text-lg font-bold text-emerald-600">{vehicle.price}</div>
                <div className="mt-3 text-sm text-slate-500">نسبة الثقة: {vehicle.trust}%</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}