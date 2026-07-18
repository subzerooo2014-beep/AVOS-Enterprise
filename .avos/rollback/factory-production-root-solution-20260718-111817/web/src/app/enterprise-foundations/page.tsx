const foundations = [
  {
    name: "Data & AI Core",
    items: [
      "Data Governance",
      "Metadata Catalog",
      "MDM",
      "Lineage",
      "Data Quality",
      "Feature Store",
      "AI Model Registry",
      "Model Monitoring",
      "Responsible AI",
      "Knowledge Graph",
    ],
  },
  {
    name: "Runtime & Integration Core",
    items: [
      "Cache",
      "Queues",
      "Event Bus",
      "Workflow",
      "Scheduler",
      "Distributed Locks",
      "Idempotency",
      "Saga",
      "Retry & DLQ",
      "Secrets",
      "Feature Flags",
      "Backup & DR",
    ],
  },
  {
    name: "Identity & Multi-Tenancy Core",
    items: [
      "IAM",
      "Tenant Isolation",
      "SSO",
      "Federation",
      "MFA",
      "Service Accounts",
      "RBAC & ABAC",
      "Consent",
      "Privacy",
      "Data Residency",
    ],
  },
  {
    name: "Developer / API / Plugin Core",
    items: [
      "API Gateway",
      "Versioning",
      "SDKs",
      "Integration Hub",
      "Webhooks",
      "Connectors",
      "Plugins",
      "Blueprint Marketplace",
      "Developer Portal",
      "Sandbox",
      "Metering",
      "Certification",
    ],
  },
  {
    name: "Legal & Global Operations Core",
    items: [
      "Legal Entities",
      "Jurisdictions",
      "Regulation Versioning",
      "Dynamic Regulation",
      "Contract Policies",
      "Retention",
      "Evidence Vault",
      "Legal Hold",
      "UAE Baseline",
      "Global Packs",
      "Localization",
      "Regional Operations",
    ],
  },
  {
    name: "Security, Observability & Experience Core",
    items: [
      "Logs",
      "Metrics",
      "Traces",
      "SOC & SIEM",
      "Threat Detection",
      "Incident Management",
      "SLO & SLA",
      "FinOps",
      "Accessibility",
      "Voice OS",
      "Digital Human",
      "Experience Composer AI",
      "Omnichannel",
    ],
  },
];

export default function EnterpriseFoundationsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">
        AVOS Enterprise
      </p>
      <h1 className="mt-2 text-3xl font-bold">
        Six Critical Enterprise Foundations
      </h1>
      <p className="mt-3 max-w-4xl text-neutral-600">
        Unified reusable foundations for every current and future AVOS
        industry, service, application, integration, and region.
      </p>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        {foundations.map((foundation) => (
          <article
            key={foundation.name}
            className="rounded-2xl border p-6"
          >
            <h2 className="text-lg font-semibold">
              {foundation.name}
            </h2>
            <ul className="mt-4 grid gap-2 text-sm text-neutral-600 sm:grid-cols-2">
              {foundation.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}