const capabilities = [
  "AVOS Smart Workspace",
  "AVOS Live Command",
  "AVOS Cockpit",
  "AVOS Story Mode",
  "AVOS Business Pulse",
  "AVOS AI Inbox",
  "AVOS Daily Mission",
  "AVOS Live Activity Feed",
  "AVOS Office View",
  "Digital Employees",
  "Sales Manager AI",
  "Finance Manager AI",
  "Marketing Manager AI",
  "Inventory Manager AI",
  "CEO Advisor AI",
  "AI Daily Briefing",
  "AI One Click",
  "Role-Based Dashboards",
  "Customizable Dashboard Layouts",
  "Advertisement Analytics Widgets",
  "Vehicle 360 Workspace",
  "Customer 360 Workspace",
  "Dealer 360 Workspace",
  "Market 360 Workspace",
  "AI 360 Workspace",
  "Unified Timeline",
  "Mission Control",
  "Command Palette",
  "Global Search Workspace",
  "Workspace Personalization",
];

export default function EnterpriseUltimateF5Page() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold text-slate-500">
        AVOS Enterprise · Smart Experience
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        AVOS Enterprise Ultimate Mega Bundle F5
      </h1>
      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((capability) => (
          <article key={capability} className="rounded-2xl border bg-white p-5">
            <h2 className="font-semibold">{capability}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}