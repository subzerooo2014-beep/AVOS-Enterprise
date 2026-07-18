const capabilities = [
  "Blueprint Registry",
  "Schema Designer",
  "Capability Composer",
  "Template Engine",
  "Code Generator",
  "API Generator",
  "Web Generator",
  "Mobile Generator",
  "Test Generator",
  "Documentation Generator",
  "Validation Engine",
  "Compatibility Engine",
  "Installation Engine",
  "Rollback Engine",
  "Version Manager",
  "Dependency Resolver",
  "Marketplace Registry",
  "Quality Gate",
  "Release Pipeline",
  "Factory Command Center",
];

export default function IndustryFactoryPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Industry Factory
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        AVOS Industry Factory & Blueprint Studio V1
      </h1>

      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        Design, validate, generate, install, version, release, and publish
        complete AVOS industry packs above the Universal Industry Core.
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