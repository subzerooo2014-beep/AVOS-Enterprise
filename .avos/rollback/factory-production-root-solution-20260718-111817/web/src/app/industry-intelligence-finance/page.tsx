const components = [
  "AI Valuation",
  "Pricing Intelligence",
  "Buyer Matching",
  "Seller Intelligence",
  "Fraud Intelligence",
  "Risk Intelligence",
  "Insurance Marketplace",
  "Insurance Quotes",
  "Policies",
  "Claims",
  "Finance Marketplace",
  "Loan Pre-Approval",
  "Installment Calculator",
  "Bank Integrations",
  "Credit Decisions",
  "Financial Analytics",
  "Executive Finance Dashboard",
];

export default function IndustryIntelligenceFinancePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">
        Industry Intelligence, Finance & Insurance Core
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Unified valuation, pricing, matching, fraud, risk, insurance,
        financing, credit, and financial analytics across industries.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {components.map((component) => (
          <article key={component} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{component}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Shared industry-based intelligence capability.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}