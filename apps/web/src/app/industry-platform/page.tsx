const industries = [
  "Cars",
  "Motorcycles",
  "Buggy",
  "Heavy Equipment",
  "Marine",
  "Aviation",
  "Camping",
  "Trucks",
  "Buses",
  "Caravans",
];

const capabilities = [
  "Sales",
  "Rentals",
  "Maintenance",
  "Parts",
  "Accessories",
  "Finance",
  "Insurance",
  "Logistics",
  "Inspections",
  "Dealerships",
  "Marketplaces",
];

export default function IndustryPlatformPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">Industry Platform Foundation</h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Industry-based architecture with reusable shared capabilities across
        every AVOS mobility industry.
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Industries</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {industries.map((industry) => (
            <article key={industry} className="rounded-2xl border p-5">
              <h3 className="font-semibold">{industry}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Shared Capabilities</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((capability) => (
            <article key={capability} className="rounded-2xl border p-5">
              <h3 className="font-semibold">{capability}</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Reusable across all active industries.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}