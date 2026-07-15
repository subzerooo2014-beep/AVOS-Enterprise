const cards = [
  ["Customer 360", "Unified customer profile, value, tags, and loyalty."],
  ["CRM Journeys", "Lifecycle stages and journey progression."],
  ["Marketing Automation", "Audience, campaign, and message orchestration."],
  ["Notifications", "Push, email, and SMS operations."],
  ["Referral Engine", "Referral qualification and rewards."],
  ["Loyalty Automation", "Points, rewards, and retention mechanics."],
  ["AI Recommendations", "Ranked customer recommendations."],
  ["Growth Analytics", "Growth metrics and executive KPIs."],
];

export default function CustomerExperienceGrowthPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">Customer Experience & Growth</h1>
      <p className="mt-3 max-w-3xl text-neutral-600">
        Customer intelligence, journeys, campaigns, loyalty, referrals,
        recommendations, and growth analytics in one operating workspace.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([title, description]) => (
          <article key={title} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-neutral-600">{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}