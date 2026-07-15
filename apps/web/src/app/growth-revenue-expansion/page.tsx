const capabilities = [
  "Growth Brain",
  "Acquisition Engine",
  "Retention Engine",
  "Referral Engine",
  "Viral Engine",
  "SEO Engine",
  "Content Factory",
  "Social Distribution AI",
  "Influencer Hub",
  "Ads Optimization AI",
  "Campaign Orchestration",
  "Experimentation Platform",
  "A/B Testing AI",
  "Conversion Optimization",
  "Customer Lifecycle Engine",
  "Loyalty Engine",
  "Personalization Engine",
  "Notification Intelligence",
  "Revenue Optimizer",
  "Adaptive Pricing Intelligence",
  "Monetization Engine",
  "Subscription Growth",
  "Upsell & Cross-Sell",
  "Market Expansion AI",
  "Localization Engine",
  "Competitor Intelligence",
  "Demand Forecasting",
  "Growth Analytics",
  "Unit Economics",
  "Growth Command Center",
];

export default function GrowthRevenueExpansionPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Growth & Revenue
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Growth, Revenue & Market Expansion Platform V1
      </h1>
      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        Unified acquisition, retention, monetization, pricing,
        experimentation, revenue, and global expansion capabilities.
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