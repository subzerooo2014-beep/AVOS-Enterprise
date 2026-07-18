"use client";

import { useAuctionGrid } from "../hooks/use-a-uc-ti-on-gr-id";

export function AuctionGrid() {
  const { items, loading, error } = useAuctionGrid();

  if (loading) {
    return <div className="rounded-3xl border bg-white p-8">Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ­Ù…ÙŠÙ„...</div>;
  }

  if (error) {
    return <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">{error}</div>;
  }

  return (
    <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">{item.title}</h2>
          <p className="mt-3 text-slate-600">{item.description}</p>
        </article>
      ))}
    </section>
  );
}