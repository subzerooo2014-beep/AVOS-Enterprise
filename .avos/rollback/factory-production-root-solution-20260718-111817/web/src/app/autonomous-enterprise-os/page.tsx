const domains = [
  {
    title: "Autonomous AI",
    items: [
      "Decision",
      "Planning",
      "Execution",
      "Optimization",
      "Learning",
      "Recovery",
    ],
  },
  {
    title: "Enterprise Swarm",
    items: [
      "Multi-Agent Swarm",
      "Task Distribution",
      "Collaboration Mesh",
      "Resource Negotiation",
      "Capability Marketplace",
      "Autonomous Delegation",
    ],
  },
  {
    title: "Self Evolution",
    items: [
      "Self-Healing",
      "Self-Optimization",
      "Self-Scaling",
      "Self-Security",
      "Self-Monitoring",
      "Self-Testing",
    ],
  },
  {
    title: "Enterprise Brain V3",
    items: [
      "Strategic",
      "Financial",
      "Operations",
      "Sales",
      "Marketing",
      "Customer",
      "Knowledge",
    ],
  },
  {
    title: "Global Operations",
    items: [
      "Global Command",
      "Monitoring",
      "Policy",
      "Compliance",
      "Deployment",
      "Disaster Recovery",
    ],
  },
  {
    title: "AI Economy",
    items: [
      "Marketplace",
      "Billing",
      "Licensing",
      "Revenue",
      "Partner Network",
      "Business Hub",
    ],
  },
];

export default function AutonomousEnterpriseOsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Autonomous Enterprise OS
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        AVOS Autonomous Enterprise OS Ultimate V1
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