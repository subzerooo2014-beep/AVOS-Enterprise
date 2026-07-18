const sections = [
  "Foundation Master Registry",
  "Product Lifecycle",
  "Architecture Decision Records",
  "Standards & Policies",
  "Production Readiness",
  "Release Approval",
  "Operations",
  "Continuous Evolution",
];

export default function FoundationCommandCenterPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Official Core Foundation
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Foundation Command Center
      </h1>
      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        Unified control for AVOS foundations, architecture decisions,
        product lifecycle, quality gates, release readiness, and evolution.
      </p>
      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => (
          <article key={section} className="rounded-2xl border p-6">
            <h2 className="text-lg font-semibold">{section}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}