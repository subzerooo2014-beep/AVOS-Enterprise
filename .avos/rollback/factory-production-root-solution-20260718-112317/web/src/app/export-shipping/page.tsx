const capabilities = [
  "Export Workflow",
  "Shipping Marketplace",
  "Carrier Matching",
  "Shipping Quotes",
  "Customs",
  "Export Documents",
  "Document Verification",
  "Certificates",
  "Bill of Lading",
  "Pickup Scheduling",
  "Port Coordination",
  "Shipment Tracking",
  "Delivery Confirmation",
  "Logistics Exceptions",
  "Export Analytics",
];

export default function ExportShippingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">
        Export, Shipping & Customs
      </h1>
      <p className="mt-3 text-neutral-600">
        Multi-country export workflow with carrier matching,
        customs, documents, shipment tracking, and delivery.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {capabilities.map((capability) => (
          <article key={capability} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{capability}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}