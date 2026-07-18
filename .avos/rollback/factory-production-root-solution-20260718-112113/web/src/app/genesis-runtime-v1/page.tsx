const capabilities = [
  "DATABASE_GENERATOR",
  "AI_AGENT_GENERATOR",
  "WORKFLOW_GENERATOR",
  "PLUGIN_GENERATOR",
  "SDK_GENERATOR",
  "DOCUMENTATION_GENERATOR",
  "TEST_GENERATOR",
  "RUNTIME_COMMAND_CENTER"
];

export default function GenesisPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">AVOS Enterprise Â· Genesis OS</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">AVOS Genesis Runtime V1</h1>
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