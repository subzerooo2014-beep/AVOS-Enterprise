import {
  AvosBadge,
  AvosButton,
  AvosCard,
  AvosInput,
  AvosMetricCard,
} from "../../design-system";

const tokenGroups = [
  "Colors",
  "Typography",
  "Spacing",
  "Radius",
  "Shadows",
  "Motion",
  "Elevation",
  "Breakpoints",
];

export default function DesignSystemFoundationPage() {
  return (
    <main className="mx-auto max-w-7xl bg-slate-50 px-6 py-10 text-slate-900">
      <AvosBadge>Official Foundation V1</AvosBadge>

      <h1 className="mt-5 text-4xl font-bold tracking-tight">
        AVOS Design System
      </h1>

      <p className="mt-3 max-w-3xl text-lg text-slate-600">
        The shared visual and interaction foundation for every AVOS
        application, dashboard, AI interface, website, mobile app,
        marketplace, and industry platform.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <AvosMetricCard
          label="Theme Strategy"
          value="Light First"
          detail="Premium and accessible enterprise experience"
        />
        <AvosMetricCard
          label="Accessibility"
          value="WCAG 2.2 AA"
          detail="Keyboard, focus, labels, contrast, and screen readers"
        />
        <AvosMetricCard
          label="Languages"
          value="Arabic + English"
          detail="RTL and LTR product readiness"
        />
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <AvosCard>
          <h2 className="text-xl font-bold">Foundation Tokens</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {tokenGroups.map((group) => (
              <AvosBadge key={group}>{group}</AvosBadge>
            ))}
          </div>
        </AvosCard>

        <AvosCard>
          <h2 className="text-xl font-bold">Component Preview</h2>
          <div className="mt-5 space-y-4">
            <AvosInput
              aria-label="Design system sample input"
              placeholder="Search AVOS components"
            />
            <AvosButton type="button">
              Explore Design System
            </AvosButton>
          </div>
        </AvosCard>
      </section>
    </main>
  );
}