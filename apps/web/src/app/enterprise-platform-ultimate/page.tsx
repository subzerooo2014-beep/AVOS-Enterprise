const domains = [
  {
    title: "Enterprise AI Agents OS",
    items: [
      "Agent Marketplace",
      "Agent Orchestrator",
      "Multi-Agent Runtime",
      "Agent Memory",
      "Agent Governance",
    ],
  },
  {
    title: "Knowledge & Digital Twin",
    items: [
      "Knowledge Graph",
      "Digital Twin",
      "Data Fabric",
      "Semantic Search",
      "Vector Intelligence",
      "AI Memory Mesh",
    ],
  },
  {
    title: "Enterprise Automation OS",
    items: [
      "BPM Engine",
      "Process Mining",
      "RPA",
      "Scheduler",
      "Workflow Studio",
    ],
  },
  {
    title: "Enterprise Security OS",
    items: [
      "Zero Trust",
      "IAM",
      "Secrets Vault",
      "SOC",
      "Threat Intelligence",
    ],
  },
  {
    title: "Enterprise Cloud OS",
    items: [
      "Kubernetes",
      "Multi Cloud",
      "DevOps",
      "CI/CD",
      "Monitoring",
      "Disaster Recovery",
    ],
  },
  {
    title: "Enterprise Marketplace OS",
    items: [
      "Plugin Marketplace",
      "Blueprint Marketplace",
      "Billing",
      "Licensing",
      "Commercial Portal",
      "Global Command Center",
    ],
  },
];

export default function EnterprisePlatformUltimatePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Ultimate Platform
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Enterprise Platform Ultimate Bundle V1
      </h1>
      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {domains.map((domain) => (
          <article key={domain.title} className="rounded-2xl border p-6">
            <h2 className="text-xl font-bold">{domain.title}</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {domain.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}