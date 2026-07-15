const suites = [
  {
    name: "Enterprise CRM Suite",
    items: [
      "Customer 360",
      "Sales",
      "Service",
      "Marketing",
      "Loyalty",
      "Customer Success",
    ],
  },
  {
    name: "Enterprise ERP Suite",
    items: [
      "Finance",
      "Procurement",
      "Inventory",
      "Warehouse",
      "HR",
      "Projects",
    ],
  },
  {
    name: "Marketplace Suite",
    items: [
      "Dealer Portal",
      "Seller Portal",
      "Buyer Portal",
      "Auctions",
      "Export",
      "Logistics",
    ],
  },
  {
    name: "AI Enterprise Suite",
    items: [
      "Executive AI",
      "Sales AI",
      "Marketing AI",
      "Finance AI",
      "Support AI",
      "Operations AI",
    ],
  },
  {
    name: "Industry Packs",
    items: [
      "Automotive",
      "Heavy Equipment",
      "Marine",
      "Aviation",
      "Camping & Caravans",
      "Motorcycles",
      "Trucks & Buses",
    ],
  },
  {
    name: "Global SaaS Platform",
    items: [
      "Multi-Tenant SaaS",
      "Subscription Billing",
      "White Label",
      "Partner Marketplace",
      "App Store",
      "Enterprise APIs",
    ],
  },
];

export default function EnterpriseProductSuitesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">
        AVOS Enterprise
      </p>
      <h1 className="mt-2 text-3xl font-bold">
        Six Enterprise Product Suites
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Productized CRM, ERP, marketplace, enterprise AI, industry packs,
        and global SaaS capabilities built on the completed AVOS foundation.
      </p>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        {suites.map((suite) => (
          <article
            key={suite.name}
            className="rounded-2xl border p-6"
          >
            <h2 className="text-lg font-semibold">{suite.name}</h2>
            <ul className="mt-4 grid gap-2 text-sm text-neutral-600 sm:grid-cols-2">
              {suite.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}