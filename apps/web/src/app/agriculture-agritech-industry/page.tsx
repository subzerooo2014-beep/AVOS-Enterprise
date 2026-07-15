const capabilities = [
  "Core Operations",
  "Asset & Resource Management",
  "Customer / Beneficiary 360",
  "Workforce & Volunteers",
  "Supply Chain",
  "Finance & Funding",
  "Compliance & Safety",
  "Risk & Resilience",
  "AI Intelligence",
  "Automation",
  "Ecosystem Marketplace",
  "Analytics & Impact",
  "Documents & Cases",
  "Notifications & Response",
  "Command Center",
];

export default function IndustryPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Industry Ultra Bundle 4-5
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Agriculture & AgriTech Industry Pack
      </h1>
      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        Farms, crops, livestock, equipment, supply chains, sustainability, AI, and command.
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