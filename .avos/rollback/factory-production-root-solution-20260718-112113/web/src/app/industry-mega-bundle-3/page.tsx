const industries = [
  {
    name: "Insurance",
    capabilities: "Policies, underwriting, claims, pricing, risk, fraud, reinsurance, brokers, compliance, and insurance AI.",
  },
  {
    name: "Retail & Commerce",
    capabilities: "Catalog, inventory, orders, payments, promotions, loyalty, stores, fulfillment, and retail AI.",
  },
  {
    name: "Hospitality",
    capabilities: "Properties, rooms, reservations, guest services, housekeeping, F&B, events, revenue, and hospitality AI.",
  },
  {
    name: "Education",
    capabilities: "Institutions, students, admissions, programs, courses, attendance, assessment, payments, and education AI.",
  },
  {
    name: "Government",
    capabilities: "Citizen services, permits, licenses, cases, payments, grants, inspections, compliance, and government AI.",
  },
];

export default function IndustryMegaBundle3Page() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Industry Expansion
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Industry Mega Bundle 3
      </h1>
      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        Enterprise operating capabilities for insurance, retail,
        hospitality, education, and government.
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