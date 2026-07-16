const capabilities = [
{{WEB_CAPABILITIES}}
];

export default function GeneratedPackPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Pack Builder
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        {{TITLE}}
      </h1>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((capability) => (
          <article key={capability} className="rounded-2xl border bg-white p-5">
            <h2 className="font-semibold">{capability}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}