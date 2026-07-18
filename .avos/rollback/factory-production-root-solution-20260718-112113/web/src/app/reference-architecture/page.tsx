const layers = [
  "Experience",
  "Application",
  "Domain",
  "Platform",
  "Data",
  "AI",
  "Integration",
  "Security",
  "Operations",
];

const registries = [
  "Capability Registry",
  "Platform Registry",
  "Industry Registry",
  "Module Registry",
  "Service Registry",
  "API Registry",
  "Event Registry",
  "Workflow Registry",
];

export default function ReferenceArchitecturePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Official Core Foundation
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Reference Architecture & Registry Foundation
      </h1>

      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        The canonical architecture model and registry control plane
        for every AVOS capability, platform service, module, API,
        event, workflow, and industry pack.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border p-5">
          <p className="text-sm text-slate-500">Architecture Layers</p>
          <p className="mt-2 text-3xl font-bold">9</p>
        </article>
        <article className="rounded-2xl border p-5">
          <p className="text-sm text-slate-500">Registry Types</p>
          <p className="mt-2 text-3xl font-bold">8</p>
        </article>
        <article className="rounded-2xl border p-5">
          <p className="text-sm text-slate-500">Standards</p>
          <p className="mt-2 text-3xl font-bold">12</p>
        </article>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border p-6">
          <h2 className="text-xl font-bold">Reference Layers</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {layers.map((layer) => (
              <div
                key={layer}
                className="rounded-xl bg-slate-50 p-4 font-medium"
              >
                {layer}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border p-6">
          <h2 className="text-xl font-bold">Official Registries</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {registries.map((registry) => (
              <div
                key={registry}
                className="rounded-xl bg-slate-50 p-4 font-medium"
              >
                {registry}
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}