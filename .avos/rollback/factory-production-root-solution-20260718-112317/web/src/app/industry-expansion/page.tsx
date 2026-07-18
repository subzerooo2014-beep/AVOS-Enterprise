export default function IndustryExpansionPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">Industry Expansion</h1>
      <p className="mt-3 max-w-3xl text-neutral-600">
        Specialized marketplaces and services for every mobility category.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Cars</h2>
          <p className="mt-2 text-sm text-neutral-600">new, used, certified, leasing.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Motorcycles</h2>
          <p className="mt-2 text-sm text-neutral-600">street, sport, touring, off-road.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Trucks</h2>
          <p className="mt-2 text-sm text-neutral-600">light, medium, heavy, commercial.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Heavy Equipment</h2>
          <p className="mt-2 text-sm text-neutral-600">construction, industrial, agriculture, rental.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Boats & Yachts</h2>
          <p className="mt-2 text-sm text-neutral-600">boats, yachts, marine-services, berths.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Aircraft</h2>
          <p className="mt-2 text-sm text-neutral-600">private, commercial, parts, services.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Number Plates</h2>
          <p className="mt-2 text-sm text-neutral-600">special, auction, valuation, transfer.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Accessories & Parts</h2>
          <p className="mt-2 text-sm text-neutral-600">oem, aftermarket, performance, electronics.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Classic Vehicles</h2>
          <p className="mt-2 text-sm text-neutral-600">classic, collectible, restoration, valuation.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Caravans & Campers</h2>
          <p className="mt-2 text-sm text-neutral-600">caravans, campers, motorhomes, accessories.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Fleet & Mobility</h2>
          <p className="mt-2 text-sm text-neutral-600">fleet, rental, subscription, corporate.</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Export Only</h2>
          <p className="mt-2 text-sm text-neutral-600">export-listings, shipping, customs, documents.</p>
        </article>
      </section>
    </main>
  );
}