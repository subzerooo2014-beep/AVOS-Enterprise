import { ApplicationGrid } from "@/components/ueap/application-grid";
import { CommandPalette } from "@/components/ueap/command-palette";
import { FeatureFlagTable } from "@/components/ueap/feature-flag-table";
import { MetricTile } from "@/components/ueap/metric-tile";
import { NotificationCenter } from "@/components/ueap/notification-center";
import { RuntimeStatus } from "@/components/ueap/runtime-status";
import { ueapApi } from "@/lib/ueap/api";
import { runtimeApplications } from "@/lib/ueap/registry";
import type {
  FeatureFlag,
  RuntimeNotification,
  RuntimeSnapshot,
} from "@/lib/ueap/types";

const fallbackStatus: RuntimeSnapshot = {
  status: "operational",
  version: "AVOS-WEB-UEAP-2.0.0",
  healthScore: 100,
  applications: runtimeApplications.length,
  tenants: 1,
  workspaces: 3,
  plugins: 15,
  notifications: 3,
  foundationFirst: true,
  capabilityFirst: true,
  humanFinalAuthority: true,
  globalComplianceReadinessGate: true,
};

const fallbackNotifications: RuntimeNotification[] = [
  {
    id: "runtime-ready",
    title: "Enterprise Runtime operational",
    message: "جميع مكونات منصة التطبيقات المؤسسية تعمل.",
    priority: "normal",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "human-authority",
    title: "Human Final Authority preserved",
    message: "القرارات الاستراتيجية ما زالت تتطلب اعتمادًا بشريًا.",
    priority: "high",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "compliance",
    title: "Global Compliance Gate active",
    message: "بوابة الجاهزية العالمية للامتثال مفعلة.",
    priority: "normal",
    read: true,
    createdAt: new Date().toISOString(),
  },
];

const fallbackFlags: FeatureFlag[] = [
  { key: "micro-frontends", enabled: true, scope: "global", rolloutPercentage: 100 },
  { key: "plugin-runtime", enabled: true, scope: "global", rolloutPercentage: 100 },
  { key: "offline-recovery", enabled: true, scope: "global", rolloutPercentage: 100 },
  { key: "ai-command-assistant", enabled: true, scope: "tenant", rolloutPercentage: 100 },
];

export default async function EnterpriseRuntimePage() {
  const [status, applications, notifications, flags] = await Promise.all([
    ueapApi.status(fallbackStatus),
    ueapApi.applications(runtimeApplications),
    ueapApi.notifications(fallbackNotifications),
    ueapApi.featureFlags(fallbackFlags),
  ]);

  return (
    <main className="ueap-page" dir="rtl">
      <section className="ueap-hero">
        <div>
          <span>AVOS-WEB-UEAP-2.0.0</span>
          <h1>منصة تشغيل التطبيقات المؤسسية</h1>
          <p>
            Micro-frontends، multi-tenant workspaces، plugins، feature flags،
            unified search، live observability، AI-native experience، وoffline recovery.
          </p>
        </div>
        <RuntimeStatus initial={status} />
      </section>

      <section className="ueap-metrics">
        <MetricTile label="Applications" value={status.applications} />
        <MetricTile label="Tenants" value={status.tenants} />
        <MetricTile label="Workspaces" value={status.workspaces} />
        <MetricTile label="Plugins" value={status.plugins} />
        <MetricTile label="Health" value={`${status.healthScore}%`} />
      </section>

      <CommandPalette />
      <ApplicationGrid applications={applications} />

      <section className="ueap-grid-two">
        <NotificationCenter notifications={notifications} />
        <FeatureFlagTable flags={flags} />
      </section>

      <section className="ueap-certification">
        <div><strong>Foundation First</strong><span>{String(status.foundationFirst)}</span></div>
        <div><strong>Capability First</strong><span>{String(status.capabilityFirst)}</span></div>
        <div><strong>Human Final Authority</strong><span>{String(status.humanFinalAuthority)}</span></div>
        <div><strong>Global Compliance Gate</strong><span>{String(status.globalComplianceReadinessGate)}</span></div>
      </section>
    </main>
  );
}
