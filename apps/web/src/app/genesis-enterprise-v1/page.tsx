const capabilities = [
  "DEPLOYMENT_GENERATOR",
  "INFRASTRUCTURE_GENERATOR",
  "VALIDATION_ENGINE",
  "QUALITY_GATE",
  "RELEASE_MANAGER",
  "ROLLBACK_MANAGER",
  "VERSION_MANAGER",
  "KNOWLEDGE_REGISTRATION",
  "ENTERPRISE_BRAIN_INTEGRATION",
  "EVOLUTION_CENTER_INTEGRATION",
  "MARKETPLACE_PUBLISHER",
  "GLOBAL_COMMAND_CENTER"
];

export default function GenesisPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">AVOS Enterprise Â· Genesis OS</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">AVOS Genesis Enterprise V1</h1>
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