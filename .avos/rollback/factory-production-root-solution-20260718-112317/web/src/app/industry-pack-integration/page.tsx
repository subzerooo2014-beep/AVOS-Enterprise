const packs = [
  "Automotive Industry Pack",
  "Heavy Equipment Industry Pack",
  "Industry Mega Bundle 1",
  "Industry Ultra Bundle 2-3",
  "Industry Ultra Bundle 4-5",
];

const stages = [
  "Discovery",
  "Compatibility Validation",
  "Adapter Generation",
  "Core Registration",
  "Migration Execution",
  "Post-Migration Verification",
];

export default function IndustryPackIntegrationPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Industry Integration
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Industry Pack Integration & Migration V1
      </h1>

      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        Connects all existing AVOS vertical packs to the Universal Industry Core
        through compatibility validation, adapters, registration, and migration.
      </p>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border p-6">
          <h2 className="text-xl font-bold">Registered Source Packs</h2>
          <ul className="mt-4 space-y-2">
            {packs.map((pack) => (
              <li key={pack} className="rounded-xl border px-4 py-3">
                {pack}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border p-6">
          <h2 className="text-xl font-bold">Migration Pipeline</h2>
          <ol className="mt-4 space-y-2">
            {stages.map((stage, index) => (
              <li key={stage} className="rounded-xl border px-4 py-3">
                {index + 1}. {stage}
              </li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}