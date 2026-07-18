export default function WorkshopAppPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <a href="/applications" className="text-sm text-neutral-500">
        Back to Applications Suite
      </a>
      <h1 className="mt-4 text-3xl font-bold">Workshop App</h1>
      <p className="mt-3 max-w-3xl text-neutral-600">Bookings, jobs, parts, warranty, and service delivery.</p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-5">
          <h2 className="font-semibold">Workspace</h2>
          <p className="mt-2 text-sm text-neutral-600">Role-based operational workspace.</p>
        </div>
        <div className="rounded-2xl border p-5">
          <h2 className="font-semibold">Activity</h2>
          <p className="mt-2 text-sm text-neutral-600">Live tasks, updates, and business events.</p>
        </div>
        <div className="rounded-2xl border p-5">
          <h2 className="font-semibold">Insights</h2>
          <p className="mt-2 text-sm text-neutral-600">KPIs, alerts, and AI recommendations.</p>
        </div>
      </section>
    </main>
  );
}