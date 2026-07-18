const capabilities = [
  "AI Search",
  "Semantic Matching",
  "Attribute Filters",
  "Trust Ranking",
  "Personalized Recommendations",
  "Recently Viewed Intelligence",
  "Cross-Industry Discovery",
  "Marketplace Analytics",
];

export default function MarketplaceAiPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Marketplace AI</h1>
      <p className="mt-3 text-neutral-600">
        Intelligent search, ranking, matching, and recommendations.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((capability) => (
          <article key={capability} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{capability}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}