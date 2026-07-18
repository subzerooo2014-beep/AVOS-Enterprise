const capabilities = [
  "Cross-Module Workflows",
  "Business Process Orchestration",
  "Approvals & SLA",
  "Event Automation",
  "Rule & Action Engine",
  "Cross-Module Integrations",
  "Process Templates",
  "Live Operations Dashboard",
  "Unified KPIs",
  "Enterprise Alerts",
  "Business Timeline",
  "AI Workflow Recommendations",
  "AI Bottleneck Detection",
  "AI Predictive Operations",
];

export default function UnifiedBusinessOperationsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">
        AVOS Enterprise
      </p>
      <h1 className="mt-2 text-3xl font-bold">
        Unified Business Operations
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        One operating layer connecting CRM, ERP, Marketplace, AI,
        Executive Intelligence, Industry Packs, and Global SaaS.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((capability) => (
          <article key={capability} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{capability}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}