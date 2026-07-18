const capabilities = [
  "Developer Platform",
  "SDK Center",
  "Public API Management",
  "Webhooks Platform",
  "Event Bus Federation",
  "Integration Marketplace",
  "Partner Portal",
  "Vendor Portal",
  "Customer Portal",
  "White Label Platform",
  "Multi-Tenant Provisioning",
  "Organization Management",
  "Identity Federation",
  "API Keys & Secrets Vault",
  "OAuth Management",
  "App Marketplace",
  "Extension SDK",
  "Plugin Runtime",
  "Plugin Registry",
  "Connector Framework",
  "ERP/CRM Connectors",
  "Payment Connectors",
  "Messaging Connectors",
  "AI Provider Connectors",
  "External Search Connectors",
  "Low-Code Automation Studio",
  "Workflow Marketplace",
  "Enterprise Templates",
  "Solution Marketplace",
  "Ecosystem Command Center",
];

export default function EcosystemPlatformPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Ecosystem Platform
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Ecosystem Platform Pack V1
      </h1>
      <p className="mt-3 max-w-4xl text-lg text-slate-600">
        Unified developer, partner, plugin, connector, marketplace,
        identity, API, automation, and ecosystem capabilities.
      </p>
      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((capability) => (
          <article key={capability} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{capability}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}