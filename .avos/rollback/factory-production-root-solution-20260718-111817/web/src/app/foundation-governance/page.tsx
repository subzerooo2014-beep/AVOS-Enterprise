const stages = [
  "Vision",
  "Brand Identity",
  "Brand DNA",
  "Design System",
  "Constitutional Foundation",
  "Strategic Foundation",
  "Platform Foundation",
  "Product Architecture",
  "Product Development",
];

const controls = [
  "Mandatory stage ordering",
  "Verified evidence per stage",
  "Platform reuse before duplication",
  "Brand and design-system conformance",
  "Constitutional and strategic alignment",
  "Production-readiness quality gates",
];

export default function FoundationGovernancePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Core Foundation Governance
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Foundation Governance & Conformance Engine
      </h1>

      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        The mandatory control layer that prevents AVOS products,
        platforms, AI systems, and industry packs from skipping the
        official foundation sequence.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border p-5">
          <p className="text-sm text-slate-500">Foundation Stages</p>
          <p className="mt-2 text-3xl font-bold">9</p>
        </article>
        <article className="rounded-2xl border p-5">
          <p className="text-sm text-slate-500">Governance Policies</p>
          <p className="mt-2 text-3xl font-bold">8</p>
        </article>
        <article className="rounded-2xl border p-5">
          <p className="text-sm text-slate-500">Quality Gates</p>
          <p className="mt-2 text-3xl font-bold">7</p>
        </article>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border p-6">
          <h2 className="text-xl font-bold">Official Stage Order</h2>
          <ol className="mt-5 space-y-3">
            {stages.map((stage, index) => (
              <li key={stage} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold">
                  {index + 1}
                </span>
                <span>{stage}</span>
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-2xl border p-6">
          <h2 className="text-xl font-bold">Mandatory Controls</h2>
          <ul className="mt-5 space-y-3">
            {controls.map((control) => (
              <li key={control} className="rounded-xl bg-slate-50 p-4">
                {control}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}