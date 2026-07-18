const components = [
  "Customer 360",
  "CRM Journeys",
  "Customer Lifecycle",
  "Trust Score",
  "Reviews & Reputation",
  "Referrals",
  "Loyalty",
  "Campaigns",
  "Notifications",
  "AI Recommendations",
  "Retention",
  "Churn Detection",
  "Growth Analytics",
  "Customer Success",
  "Growth Command Center",
];

export default function IndustryCustomerGrowthPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">
        Industry Customer, Trust & Growth Core
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Unified customer, trust, reputation, referral, loyalty,
        recommendation, retention, and growth capabilities across industries.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {components.map((component) => (
          <article key={component} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{component}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Shared industry-based customer capability.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}