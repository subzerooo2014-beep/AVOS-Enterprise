export const PLATFORM_OS_V2_CAPABILITIES = [
  'enterprise-runtime-v2',
  'module-runtime',
  'dynamic-module-loader',
  'runtime-registry',
  'runtime-health-engine',
  'runtime-diagnostics',
  'runtime-lifecycle',
  'runtime-context-engine',
  'plugin-registry',
  'plugin-installer',
  'plugin-marketplace',
  'plugin-sandbox',
  'plugin-security',
  'plugin-permissions',
  'plugin-versioning',
  'plugin-dependencies',
  'plugin-update-engine',
  'plugin-rollback-engine',
  'capability-registry-v2',
  'capability-discovery',
  'capability-activation',
  'capability-policies',
  'capability-marketplace',
  'capability-graph',
  'capability-metrics',
  'capability-dependencies',
  'extension-sdk',
  'extension-loader',
  'extension-api-engine',
  'extension-lifecycle',
  'extension-security',
  'extension-events',
  'extension-storage',
  'extension-marketplace',
  'enterprise-app-store',
  'enterprise-package-registry',
  'app-installation-engine',
  'app-update-engine',
  'app-rollback-engine',
  'license-manager',
  'enterprise-catalog',
  'release-channel-engine',
  'dynamic-configuration',
  'environment-profile-engine',
  'feature-flag-engine',
  'secrets-provider-engine',
  'configuration-validation',
  'configuration-versioning',
  'configuration-live-reload',
  'policy-configuration',
  'backend-sdk',
  'flutter-sdk',
  'web-sdk',
  'partner-sdk',
  'integration-sdk',
  'testing-sdk',
  'cli-sdk',
  'generator-sdk',
  'module-policy-engine',
  'runtime-policy-engine',
  'plugin-governance',
  'dependency-governance',
  'security-governance',
  'upgrade-governance',
  'compatibility-engine',
  'policy-enforcement-engine',
  'runtime-dashboard-engine',
  'module-dashboard-engine',
  'plugin-dashboard-engine',
  'health-dashboard-engine',
  'platform-metrics-engine',
  'platform-alerts-engine',
  'platform-audit-engine',
  'platform-telemetry-engine',
  'auto-registration-engine',
  'auto-discovery-engine',
  'auto-upgrade-engine',
  'auto-rollback-engine',
  'auto-recovery-engine',
  'auto-diagnostics-engine',
  'auto-optimization-engine',
  'auto-validation-engine',
] as const;

export type PlatformOsV2Capability =
  (typeof PLATFORM_OS_V2_CAPABILITIES)[number];

export interface PlatformComponentRecord {
  id: string;
  name: string;
  capability: PlatformOsV2Capability;
  version: string;
  enabled: boolean;
  status: 'registered' | 'active' | 'disabled' | 'failed';
  metadata: Record<string, string | number | boolean>;
}

export interface PlatformOperationResult {
  capability: PlatformOsV2Capability;
  success: boolean;
  score: number;
  status: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export interface PlatformOsDashboardSnapshot {
  generatedAt: string;
  registeredCapabilities: number;
  activeModules: number;
  activePlugins: number;
  activeExtensions: number;
  healthyComponents: number;
  automationRate: number;
  governanceScore: number;
  platformScore: number;
  capabilityStatus: Record<PlatformOsV2Capability, 'operational'>;
}