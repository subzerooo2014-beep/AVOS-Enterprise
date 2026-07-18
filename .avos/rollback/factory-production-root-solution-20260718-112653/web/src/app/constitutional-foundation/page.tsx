const constitutions = [
  {
    name: "Technical Constitution",
    principles: [
      "Modular Architecture",
      "Shared Core Platform",
      "Multi-Industry Foundation",
      "Reusable Capabilities",
      "Minimal Code Duplication",
      "Scalability by Design",
    ],
  },
  {
    name: "Business Constitution",
    principles: [
      "Commerce Engine",
      "Lead-to-Deal Lifecycle",
      "Revenue Engine",
      "Revenue Protection",
      "Multiple Revenue Streams",
      "Partner Management",
    ],
  },
  {
    name: "Executive Constitution",
    principles: [
      "Command Center",
      "Owner AI",
      "Presidential Office",
      "Board of Directors AI",
      "Governance",
      "Permissions",
      "Human Final Decision Authority",
    ],
  },
  {
    name: "Growth Constitution",
    principles: [
      "Growth Architecture",
      "Organic Growth",
      "Viral Engine",
      "Referral Engine",
      "Creator Economy",
      "Community Engine",
      "Enterprise Partnerships",
      "AI Growth Brain",
      "Global Expansion",
    ],
  },
  {
    name: "Trust Constitution",
    principles: [
      "Identity Verification",
      "Trust & Reputation",
      "Audit Trail",
      "Anti-Fraud",
      "Compliance",
      "Privacy",
      "Security",
      "Dispute Management",
    ],
  },
];

export default function ConstitutionalFoundationPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">
        AVOS Enterprise
      </p>
      <h1 className="mt-2 text-3xl font-bold">
        Constitutional Foundation
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Permanent technical, business, executive, growth, and trust
        principles governing every future AVOS industry and capability.
      </p>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        {constitutions.map((constitution) => (
          <article
            key={constitution.name}
            className="rounded-2xl border p-6"
          >
            <h2 className="text-lg font-semibold">
              {constitution.name}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-neutral-600">
              {constitution.principles.map((principle) => (
                <li key={principle}>{principle}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}