const capabilities = [
  "Live Auctions",
  "Real-Time Bidding",
  "Proxy Bidding",
  "Buy Now",
  "Reserve Price",
  "Anti-Sniping",
  "Winner Selection",
  "Bid History",
  "Fraud Detection",
  "AI Recommendations",
  "Dealer Auctions",
  "Public & Private Auctions",
];

export default function LiveAuctionsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">
        Live Auctions & Real-Time Bidding
      </h1>
      <p className="mt-3 text-neutral-600">
        Multi-industry auction execution with bidding intelligence,
        moderation, analytics, and anti-sniping protection.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((capability) => (
          <article
            key={capability}
            className="rounded-2xl border p-5"
          >
            <h2 className="font-semibold">{capability}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}