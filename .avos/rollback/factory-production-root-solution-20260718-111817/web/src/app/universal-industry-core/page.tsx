const capabilities = [
  "Universal Industry Engine",
  "Industry Registry",
  "Industry Runtime",
  "Workflow Engine",
  "AI Intelligence",
  "Asset Engine",
  "Finance Engine",
  "Compliance Engine",
  "Risk Engine",
  "Analytics Engine",
  "Command Center",
  "Dashboard Engine",
  "Notification Engine",
  "Automation Engine",
  "Report Engine",
  "KPI Engine",
  "Document Engine",
  "Integration Engine",
  "Plugin SDK",
  "Template Engine",
];

export default function UniversalIndustryCorePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Universal Industry Core
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        AVOS Universal Industry Core V1
      </h1>

      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        Shared industry runtime, governance, intelligence, operations,
        integrations, plugins, and templates for every AVOS vertical.
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