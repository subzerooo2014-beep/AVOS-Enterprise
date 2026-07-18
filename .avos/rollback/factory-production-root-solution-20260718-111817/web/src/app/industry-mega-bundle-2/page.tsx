const industries = [
  {
    name: "Aviation",
    capabilities: "Aircraft, flight operations, crew, maintenance, airports, safety, revenue, and aviation AI.",
  },
  {
    name: "Maritime",
    capabilities: "Vessels, voyages, ports, cargo, crew, maintenance, customs, chartering, and maritime AI.",
  },
  {
    name: "Agriculture",
    capabilities: "Farms, fields, crops, livestock, irrigation, supply chain, quality, sustainability, and agriculture AI.",
  },
  {
    name: "Energy & Utilities",
    capabilities: "Assets, generation, grid, distribution, metering, outages, billing, sustainability, and energy AI.",
  },
  {
    name: "Banking & Finance",
    capabilities: "Onboarding, accounts, payments, lending, treasury, risk, fraud, compliance, wealth, and banking AI.",
  },
];

export default function IndustryMegaBundle2Page() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Industry Expansion
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Industry Mega Bundle 2
      </h1>
      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        Enterprise operating capabilities for aviation, maritime,
        agriculture, energy, utilities, banking, and finance.
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