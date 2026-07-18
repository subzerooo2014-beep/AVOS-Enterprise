const groups = [
  "Checkout & Cart",
  "Reservations & Bookings",
  "Offers & Negotiation",
  "Contracts & Signatures",
  "Escrow & Timeline",
  "Payments & Wallet",
  "Refunds & Commissions",
  "Tax, Invoices & Receipts",
  "Orders & Fulfillment",
  "Delivery & Pickup",
  "Export Workflow",
  "Shipping & Carriers",
  "Tracking & Customs",
  "Buyer ↔ Seller Chat",
  "Finance & Insurance Chat",
  "Notification Center",
];

export default function MarketplaceExecutionPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">
        Marketplace Execution Center
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Unified multi-industry transaction execution from checkout and
        negotiation through payment, fulfillment, shipment, and delivery.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {groups.map((group) => (
          <article key={group} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{group}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Governed, auditable, and revenue-protected execution.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}