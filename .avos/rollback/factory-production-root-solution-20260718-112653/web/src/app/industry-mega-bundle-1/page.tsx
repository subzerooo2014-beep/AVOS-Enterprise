const industries = [
  {
    name: "Healthcare",
    capabilities: "Patients, clinical operations, pharmacy, laboratory, billing, claims, compliance, and clinical AI.",
  },
  {
    name: "Construction",
    capabilities: "Projects, sites, contracts, cost control, workforce, materials, safety, progress, and project AI.",
  },
  {
    name: "Manufacturing",
    capabilities: "Plants, production orders, BOM, work centers, quality, maintenance, OEE, and manufacturing AI.",
  },
  {
    name: "Logistics & Fleet",
    capabilities: "Fleet, drivers, routes, shipments, dispatch, warehouses, tracking, fuel, and logistics AI.",
  },
  {
    name: "Real Estate",
    capabilities: "Properties, units, leases, sales, tenants, facilities, payments, valuations, and real-estate AI.",
  },
];

export default function IndustryMegaBundle1Page() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Industry Expansion
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Industry Mega Bundle 1
      </h1>
      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        Unified enterprise operating capabilities for five strategic industries.
      </p>
      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {industries.map((industry) => (
          <article key={industry.name} className="rounded-2xl border p-6">
            <h2 className="text-xl font-bold">{industry.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {industry.capabilities}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}