const capabilities = [
  "Enterprise Brain V2",
  "Decision Graph",
  "Knowledge Memory",
  "Agent Orchestration",
  "Scenario Simulation",
  "Predictive Intelligence",
  "Strategic Planning",
  "Risk Intelligence",
  "Market Intelligence",
  "Customer Intelligence",
  "Operations Intelligence",
  "Financial Intelligence",
  "Ecosystem Intelligence",
  "Policy Intelligence",
  "Regulatory Intelligence",
  "Explainability",
  "AI Governance",
  "Model Registry",
  "Prompt Registry",
  "Tool Registry",
  "Agent Registry",
  "Memory Registry",
  "Knowledge Graph",
  "Decision Audit",
  "Human Approval",
  "Autonomous Execution",
  "Learning Feedback",
  "Quality Evaluation",
  "Intelligence Health",
  "Intelligence Command Center",
];

export default function GlobalIntelligencePlatformPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Global Intelligence
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Enterprise Brain V2
      </h1>
      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        Unified intelligence, decisions, agents, memory, simulation,
        governance, learning, and autonomous execution across AVOS.
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