export default function GrandBusinessProductPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">Grand Business Product</h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Unified product operations covering marketplace, auctions, finance,
        insurance, export, dealers, workshops, parts, customer growth,
        revenue, partners, and executive command.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Vehicle Marketplace</h2>
          <p className="mt-2 text-sm text-neutral-600">listings, search, compare, favorites, offers, deals, media, trust.</p>
        </article>
        <article className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Auction Platform</h2>
          <p className="mt-2 text-sm text-neutral-600">scheduled-auctions, live-auctions, auto-bid, deposits, extensions, settlement, winner-flow, audit.</p>
        </article>
        <article className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Finance & Insurance</h2>
          <p className="mt-2 text-sm text-neutral-600">finance-requests, pre-approval, bank-offers, installments, insurance-quotes, policies, claims, renewals.</p>
        </article>
        <article className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Export & Logistics</h2>
          <p className="mt-2 text-sm text-neutral-600">export-only, shipping-quotes, customs, documents, tracking, carriers, ports, delivery.</p>
        </article>
        <article className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Dealer & Workshop Suite</h2>
          <p className="mt-2 text-sm text-neutral-600">dealer-inventory, crm-leads, quotes, contracts, bookings, jobs, parts, warranty.</p>
        </article>
        <article className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Parts & Accessories Commerce</h2>
          <p className="mt-2 text-sm text-neutral-600">catalog, fitment, suppliers, stock, orders, returns, bundles, recommendations.</p>
        </article>
        <article className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Customer Growth Platform</h2>
          <p className="mt-2 text-sm text-neutral-600">customer-360, journeys, campaigns, notifications, referrals, loyalty, reviews, recommendations.</p>
        </article>
        <article className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Revenue Operations</h2>
          <p className="mt-2 text-sm text-neutral-600">subscriptions, billing, payments, commissions, ads, coupons, refunds, analytics.</p>
        </article>
        <article className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Partner Network</h2>
          <p className="mt-2 text-sm text-neutral-600">onboarding, verification, agreements, sla, performance, settlements, webhooks, marketplace.</p>
        </article>
        <article className="rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">Business Command Center</h2>
          <p className="mt-2 text-sm text-neutral-600">kpis, revenue, growth, risk, operations, alerts, approvals, forecast.</p>
        </article>
      </section>
    </main>
  );
}