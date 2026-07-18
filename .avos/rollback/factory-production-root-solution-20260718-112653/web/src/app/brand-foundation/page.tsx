const foundationOrder = [
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

const traits = [
  "Premium",
  "AI First",
  "Global",
  "Trusted",
  "Intelligent",
  "Scalable",
];

export default function BrandFoundationPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">
        AVOS Enterprise · Official Core Foundation
      </p>

      <section className="mt-3 rounded-3xl border p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
          AV Wing Motion
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          AVOS Enterprise
        </h1>

        <p className="mt-3 text-xl text-neutral-600">
          The Operating System for Mobility
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {traits.map((trait) => (
            <span
              key={trait}
              className="rounded-full border px-4 py-2 text-sm font-semibold"
            >
              {trait}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">
          Mandatory Product Foundation Order
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {foundationOrder.map((layer, index) => (
            <article key={layer} className="rounded-2xl border p-5">
              <p className="text-sm text-neutral-500">
                Layer {index + 1}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{layer}</h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}