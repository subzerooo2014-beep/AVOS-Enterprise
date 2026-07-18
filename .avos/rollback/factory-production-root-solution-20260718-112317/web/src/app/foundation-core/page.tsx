const foundations = [
  "Core Platform",
  "Industry Architecture",
  "Commerce",
  "Revenue",
  "Revenue Protection",
  "Audit & Tracking",
  "Governance & Permissions",
  "Event Tracking",
  "Lead → Deal Pipeline",
  "Shared Capabilities",
  "Command Center",
  "Owner AI",
  "Executive Dashboard",
  "Business Intelligence",
  "Constitution & Governance",
  "Executive Management",
  "Platform Registry",
  "Industry Registry",
  "Capability Registry",
];

export default function FoundationCorePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">
        Foundation Core Architecture
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Industry-based institutional foundation shared by every future AVOS
        industry and business capability.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {foundations.map((foundation) => (
          <article key={foundation} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{foundation}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Shared governed enterprise foundation.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}