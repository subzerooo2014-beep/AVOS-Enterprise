const metrics = [
  { label: "Fleet availability", value: "Live" },
  { label: "Utilization intelligence", value: "Enabled" },
  { label: "Predictive maintenance", value: "Active" },
  { label: "Safety and compliance", value: "Controlled" },
];

const operatingDomains = [
  {
    title: "Fleet & Asset Control",
    description:
      "Equipment registry, lifecycle, ownership, valuation, documents, fleet numbers, branches, and sites.",
  },
  {
    title: "Sites & Deployment",
    description:
      "Project sites, operator assignment, deployment planning, shifts, utilization, operating hours, and idle time.",
  },
  {
    title: "Maintenance & Workshops",
    description:
      "Inspections, defects, preventive maintenance, breakdowns, work orders, technicians, warranty, and recalls.",
  },
  {
    title: "Rental & Commercial",
    description:
      "Rental contracts, rates, deposits, listings, equipment sales, auctions, trade-in, finance, and insurance.",
  },
  {
    title: "Parts & Supply",
    description:
      "Spare-parts inventory, compatibility, warehouses, stock adjustments, and intelligent reorder controls.",
  },
  {
    title: "Telematics & AI",
    description:
      "Live readings, fault codes, fuel efficiency, geolocation, predictive maintenance, safety risk, and valuation AI.",
  },
  {
    title: "Safety & Compliance",
    description:
      "Operator certification, pre-use checks, HSE controls, incidents, regulatory inspections, and audit readiness.",
  },
  {
    title: "Executive Intelligence",
    description:
      "Fleet KPIs, total cost of ownership, asset values, revenue, utilization, maintenance, and site dashboards.",
  },
];

export default function HeavyEquipmentIndustryPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">
        AVOS Enterprise · Industry Platform
      </p>

      <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Heavy Equipment Industry Pack
          </h1>
          <p className="mt-3 max-w-4xl text-neutral-600">
            A complete operating layer for heavy-equipment fleets, project
            sites, rentals, maintenance, parts, safety, telematics, commercial
            operations, and AI-driven fleet intelligence.
          </p>
        </div>

        <span className="w-fit rounded-full border px-4 py-2 text-sm font-semibold">
          Production Architecture
        </span>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border p-5">
            <p className="text-sm text-neutral-500">{metric.label}</p>
            <p className="mt-2 text-xl font-semibold">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {operatingDomains.map((domain) => (
          <article key={domain.title} className="rounded-2xl border p-6">
            <h2 className="text-lg font-semibold">{domain.title}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {domain.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}