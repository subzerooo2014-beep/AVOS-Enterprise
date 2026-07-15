const sections = [
  "Vehicle Registry",
  "New & Used Sales",
  "Fleet & Dealer Sales",
  "Trade-In",
  "Vehicle Inventory",
  "Listings & Search",
  "AI Matching",
  "Service & Workshops",
  "Maintenance & Warranty",
  "Finance & Leasing",
  "Insurance",
  "Shipping & Export",
  "Customs & Tracking",
  "Vehicle AI",
  "Automotive KPIs",
  "Executive Reports",
];

export default function AutomotiveIndustryPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">
        AVOS Enterprise
      </p>
      <h1 className="mt-2 text-3xl font-bold">
        Automotive Industry Pack
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        End-to-end automotive operations for vehicles, sales,
        inventory, service, finance, logistics, AI, and executive control.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => (
          <article key={section} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{section}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}