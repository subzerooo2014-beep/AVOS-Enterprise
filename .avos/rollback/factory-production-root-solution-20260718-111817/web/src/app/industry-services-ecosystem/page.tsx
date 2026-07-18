const groups = [
  "Service Booking",
  "Workshop Management",
  "Technician Scheduling",
  "Maintenance Plans",
  "Repair Orders",
  "Service History",
  "Inspection",
  "Condition Reports",
  "Inspection Certificates",
  "Warranty",
  "Warranty Claims",
  "Parts Catalog",
  "Parts Orders",
  "Accessories",
  "Mobile Service",
  "Roadside Assistance",
  "Pickup & Delivery",
];

export default function IndustryServicesEcosystemPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">
        Industry Services Ecosystem
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        End-to-end service, workshop, inspection, warranty, parts,
        accessories, and field-service operations across all industries.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {groups.map((group) => (
          <article key={group} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{group}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Shared industry-based service capability.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}