const components = [
  "Industry Offers",
  "Industry Pricing",
  "Subscriptions",
  "Payments",
  "Commissions",
  "Platform Fees",
  "Revenue Protection",
  "Leakage Detection",
  "Revenue Analytics",
  "Settlement Foundation",
];

export default function IndustryCommerceRevenuePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">
        Industry Commerce & Revenue Core
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Unified commerce, pricing, subscriptions, payments, commissions,
        fees, and revenue protection across every AVOS industry.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {components.map((component) => (
          <article key={component} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{component}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Shared industry-based revenue capability.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}