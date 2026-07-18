const cards = [
  ["Subscriptions", "Free, Pro, Premium, and Enterprise plans."],
  ["Billing", "Invoice creation, tax, discounts, and totals."],
  ["Payments", "Payment authorization, capture, and reconciliation."],
  ["Commissions", "Revenue commissions across sales and services."],
  ["Advertising", "Paid campaigns, budget, spend, and completion."],
  ["Coupons", "Percentage and fixed-value promotions."],
  ["Refunds", "Refund requests, approvals, and completion."],
  ["Revenue Analytics", "Captured revenue, commissions, and KPIs."],
];

export default function RevenueCommercePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">Revenue & Commerce</h1>
      <p className="mt-3 max-w-3xl text-neutral-600">
        Subscriptions, billing, payments, commissions, advertisements,
        coupons, refunds, and revenue intelligence.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([title, description]) => (
          <article key={title} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-neutral-600">{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}