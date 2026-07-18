const components = [
  "Governance",
  "Permissions",
  "Role Policies",
  "Approvals",
  "Compliance",
  "Regulatory Checks",
  "Risk Assessments",
  "Fraud Controls",
  "Partner Onboarding",
  "Partner Verification",
  "Agreements",
  "SLA Management",
  "Performance",
  "Settlements",
  "Disputes",
  "Audit Trail",
  "Constitutional Policies",
  "Executive Approval Center",
  "Partner Command Center",
];

export default function IndustryGovernancePartnersPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">
        Industry Governance, Compliance & Partner Ecosystem
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Unified governance, permissions, approvals, compliance, risk,
        partner onboarding, agreements, SLAs, settlements, and audit.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {components.map((component) => (
          <article key={component} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{component}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Governed industry-based enterprise capability.
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}