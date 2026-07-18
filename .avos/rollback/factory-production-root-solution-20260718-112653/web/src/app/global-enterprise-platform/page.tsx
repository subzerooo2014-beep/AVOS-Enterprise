const capabilities = [
  "Tenant Federation",
  "Master Data Hub",
  "Customer 360",
  "Asset Registry",
  "Identity & Access",
  "Workflow Hub",
  "AI Orchestrator",
  "Notification Center",
  "Document Center",
  "Search Engine",
  "Analytics & BI",
  "Audit & Compliance",
  "Cross-Industry Reporting",
  "Integration Hub",
  "Public API Gateway",
  "Event Streaming",
  "Enterprise Scheduler",
  "Automation Center",
  "Configuration Center",
  "Feature Flags",
  "Plugin Marketplace",
  "License & Subscription",
  "Billing Orchestrator",
  "Multi-Region Deployment",
  "Disaster Recovery",
  "Backup & Restore",
  "Observability",
  "Enterprise Health",
  "AI Governance",
  "Enterprise Command Center",
];

export default function GlobalEnterprisePlatformPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Global Platform
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Global Enterprise Platform Pack V1
      </h1>
      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        Unified global platform services shared by every AVOS product and industry.
      </p>
      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((capability) => (
          <article key={capability} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{capability}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}