const components = [
  "Order Management",
  "Inventory",
  "Reservations",
  "Fulfillment",
  "Service Execution",
  "Maintenance Operations",
  "Inspection Operations",
  "Logistics Operations",
  "Delivery & Handover",
  "SLA Management",
  "Exception Management",
  "Operations Command Center",
];

export default function IndustryOperationsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">
        Industry Operations & Fulfillment Core
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Unified order, inventory, reservation, fulfillment, service,
        logistics, delivery, SLA, and exception operations across industries.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {components.map((component) => (
          <article key={component} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{component}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Shared industry-based operational capability.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}