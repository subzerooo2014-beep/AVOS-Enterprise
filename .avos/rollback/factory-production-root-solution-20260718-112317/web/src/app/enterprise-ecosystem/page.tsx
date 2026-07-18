const hubs = [
  {
    title: "Banking Hub",
    description: "Applications, offers, approvals, and settlements.",
  },
  {
    title: "Insurance Hub",
    description: "Quotes, policies, claims, and renewals.",
  },
  {
    title: "Export & Logistics Hub",
    description: "Shipments, tracking, customs, and delivery.",
  },
  {
    title: "Government Services Gateway",
    description: "Registrations, permits, fees, and verification.",
  },
  {
    title: "Dealer Network",
    description: "Inventory, leads, sales, and performance.",
  },
  {
    title: "Workshop Network",
    description: "Bookings, jobs, parts, and warranty.",
  },
  {
    title: "Fleet Management",
    description: "Vehicles, drivers, maintenance, and utilization.",
  },
  {
    title: "Auctions Hub",
    description: "Auctions, bids, settlement, and compliance.",
  },
  {
    title: "AI Partner Marketplace",
    description: "Agents, plugins, blueprints, and ratings.",
  },
  {
    title: "Enterprise Integrations",
    description: "Connectors, webhooks, synchronization, and monitoring.",
  },
];

export default function EnterpriseEcosystemPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">Enterprise Ecosystem</h1>
      <p className="mt-3 max-w-3xl text-neutral-600">
        Banking, insurance, logistics, government, dealer, workshop, fleet,
        auctions, AI partners, and enterprise integrations.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {hubs.map((hub) => (
          <article key={hub.title} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{hub.title}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              {hub.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}