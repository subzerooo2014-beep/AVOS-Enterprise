const capabilities = [
  { name: "Commercial Launch Center", key: "commercial-launch-center" },
  { name: "Multi-Tenant Enterprise Management", key: "multi-tenant-management" },
  { name: "User & Role Management", key: "user-role-management" },
  { name: "Identity / SSO / MFA", key: "identity-sso-mfa" },
  { name: "Real Subscription Activation", key: "subscription-activation" },
  { name: "Revenue Operations Center", key: "revenue-operations-center" },
  { name: "Executive Business Dashboard", key: "executive-business-dashboard" },
  { name: "Business Intelligence & KPIs", key: "business-intelligence-kpis" },
  { name: "AI Operations Center", key: "ai-operations-center" },
  { name: "Multi-Country / Multi-Currency", key: "multi-country-currency" },
  { name: "Multi-Language", key: "multi-language" },
  { name: "Mobile Release Center", key: "mobile-release-center" },
  { name: "Web Release Center", key: "web-release-center" },
  { name: "App Marketplace", key: "app-marketplace" },
  { name: "Plugin Marketplace", key: "plugin-marketplace" },
  { name: "Partner Onboarding", key: "partner-onboarding" },
  { name: "Banking Connections", key: "banking-connections" },
  { name: "Insurance Connections", key: "insurance-connections" },
  { name: "Export & Logistics Connections", key: "export-logistics-connections" },
  { name: "Government Gateway Connections", key: "government-gateway-connections" },
  { name: "Marketing Launch Center", key: "marketing-launch-center" },
  { name: "Growth Engine", key: "growth-engine" },
  { name: "Reputation & Reviews", key: "reputation-reviews" },
  { name: "Customer Communication Center", key: "customer-communication-center" },
  { name: "Support & Ticket Center", key: "support-ticket-center" },
  { name: "Compliance Center", key: "compliance-center" },
  { name: "Financial Reporting", key: "financial-reporting" },
  { name: "AI Business Insights", key: "ai-business-insights" },
  { name: "Live Monitoring Center", key: "live-monitoring-center" },
  { name: "Operations Command Center", key: "operations-command-center" }
];

export default function CommercialLaunchPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-neutral-500">AVOS Enterprise</p>
      <h1 className="mt-2 text-3xl font-bold">Commercial Launch Platform</h1>
      <p className="mt-3 max-w-3xl text-neutral-600">
        Unified commercial launch, operations, growth, compliance, release,
        integrations, and executive control.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {capabilities.map((capability) => (
          <article key={capability.name} className="rounded-2xl border p-5">
            <h2 className="font-semibold">{capability.name}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              {capability.key}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}