export default function ApplicationsSuitePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
        <h1 className="text-3xl font-bold">Applications Suite</h1>
        <p className="mt-2 text-neutral-600">
          Unified workspaces for customers, dealers, partners, operations, and executives.
        </p>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <a href="/applications/customer-app" className="rounded-2xl border p-6 transition hover:shadow-md">
          <h2 className="text-xl font-semibold">Customer App</h2>
          <p className="mt-2 text-sm text-neutral-600">AVOS Customer App workspace.</p>
        </a>
        <a href="/applications/dealer-app" className="rounded-2xl border p-6 transition hover:shadow-md">
          <h2 className="text-xl font-semibold">Dealer App</h2>
          <p className="mt-2 text-sm text-neutral-600">AVOS Dealer App workspace.</p>
        </a>
        <a href="/applications/workshop-app" className="rounded-2xl border p-6 transition hover:shadow-md">
          <h2 className="text-xl font-semibold">Workshop App</h2>
          <p className="mt-2 text-sm text-neutral-600">AVOS Workshop App workspace.</p>
        </a>
        <a href="/applications/finance-partner-app" className="rounded-2xl border p-6 transition hover:shadow-md">
          <h2 className="text-xl font-semibold">Finance Partner App</h2>
          <p className="mt-2 text-sm text-neutral-600">AVOS Finance Partner App workspace.</p>
        </a>
        <a href="/applications/insurance-partner-app" className="rounded-2xl border p-6 transition hover:shadow-md">
          <h2 className="text-xl font-semibold">Insurance Partner App</h2>
          <p className="mt-2 text-sm text-neutral-600">AVOS Insurance Partner App workspace.</p>
        </a>
        <a href="/applications/logistics-app" className="rounded-2xl border p-6 transition hover:shadow-md">
          <h2 className="text-xl font-semibold">Logistics App</h2>
          <p className="mt-2 text-sm text-neutral-600">AVOS Logistics App workspace.</p>
        </a>
        <a href="/applications/admin-console" className="rounded-2xl border p-6 transition hover:shadow-md">
          <h2 className="text-xl font-semibold">Admin Console</h2>
          <p className="mt-2 text-sm text-neutral-600">AVOS Admin Console workspace.</p>
        </a>
        <a href="/applications/executive-dashboard" className="rounded-2xl border p-6 transition hover:shadow-md">
          <h2 className="text-xl font-semibold">Executive Dashboard</h2>
          <p className="mt-2 text-sm text-neutral-600">AVOS Executive Dashboard workspace.</p>
        </a>
      </section>
    </main>
  );
}