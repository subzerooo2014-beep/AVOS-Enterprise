import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'platform-os-v2',
);

const requiredFiles = [
  'platform-os-v2.types.ts',
  'platform-os-v2.module.ts',
  'platform-os-v2.controller.ts',
  'platform-os-v2-orchestrator.service.ts',
  'platform-os-v2-dashboard.service.ts',
  'dto/platform-component.dto.ts',
  'dto/platform-operation.dto.ts',
  'services/enterprise-runtime-v2.service.ts',
  'services/module-runtime.service.ts',
  'services/dynamic-module-loader.service.ts',
  'services/runtime-registry.service.ts',
  'services/runtime-health-engine.service.ts',
  'services/runtime-diagnostics.service.ts',
  'services/runtime-lifecycle.service.ts',
  'services/runtime-context-engine.service.ts',
  'services/plugin-registry.service.ts',
  'services/plugin-installer.service.ts',
  'services/plugin-marketplace.service.ts',
  'services/plugin-sandbox.service.ts',
  'services/plugin-security.service.ts',
  'services/plugin-permissions.service.ts',
  'services/plugin-versioning.service.ts',
  'services/plugin-dependencies.service.ts',
  'services/plugin-update-engine.service.ts',
  'services/plugin-rollback-engine.service.ts',
  'services/capability-registry-v2.service.ts',
  'services/capability-discovery.service.ts',
  'services/capability-activation.service.ts',
  'services/capability-policies.service.ts',
  'services/capability-marketplace.service.ts',
  'services/capability-graph.service.ts',
  'services/capability-metrics.service.ts',
  'services/capability-dependencies.service.ts',
  'services/extension-sdk.service.ts',
  'services/extension-loader.service.ts',
  'services/extension-api-engine.service.ts',
  'services/extension-lifecycle.service.ts',
  'services/extension-security.service.ts',
  'services/extension-events.service.ts',
  'services/extension-storage.service.ts',
  'services/extension-marketplace.service.ts',
  'services/enterprise-app-store.service.ts',
  'services/enterprise-package-registry.service.ts',
  'services/app-installation-engine.service.ts',
  'services/app-update-engine.service.ts',
  'services/app-rollback-engine.service.ts',
  'services/license-manager.service.ts',
  'services/enterprise-catalog.service.ts',
  'services/release-channel-engine.service.ts',
  'services/dynamic-configuration.service.ts',
  'services/environment-profile-engine.service.ts',
  'services/feature-flag-engine.service.ts',
  'services/secrets-provider-engine.service.ts',
  'services/configuration-validation.service.ts',
  'services/configuration-versioning.service.ts',
  'services/configuration-live-reload.service.ts',
  'services/policy-configuration.service.ts',
  'services/backend-sdk.service.ts',
  'services/flutter-sdk.service.ts',
  'services/web-sdk.service.ts',
  'services/partner-sdk.service.ts',
  'services/integration-sdk.service.ts',
  'services/testing-sdk.service.ts',
  'services/cli-sdk.service.ts',
  'services/generator-sdk.service.ts',
  'services/module-policy-engine.service.ts',
  'services/runtime-policy-engine.service.ts',
  'services/plugin-governance.service.ts',
  'services/dependency-governance.service.ts',
  'services/security-governance.service.ts',
  'services/upgrade-governance.service.ts',
  'services/compatibility-engine.service.ts',
  'services/policy-enforcement-engine.service.ts',
  'services/runtime-dashboard-engine.service.ts',
  'services/module-dashboard-engine.service.ts',
  'services/plugin-dashboard-engine.service.ts',
  'services/health-dashboard-engine.service.ts',
  'services/platform-metrics-engine.service.ts',
  'services/platform-alerts-engine.service.ts',
  'services/platform-audit-engine.service.ts',
  'services/platform-telemetry-engine.service.ts',
  'services/auto-registration-engine.service.ts',
  'services/auto-discovery-engine.service.ts',
  'services/auto-upgrade-engine.service.ts',
  'services/auto-rollback-engine.service.ts',
  'services/auto-recovery-engine.service.ts',
  'services/auto-diagnostics-engine.service.ts',
  'services/auto-optimization-engine.service.ts',
  'services/auto-validation-engine.service.ts',
  'controllers/runtime-platform.controller.ts',
  'controllers/plugins-platform.controller.ts',
  'controllers/capabilities-platform.controller.ts',
  'controllers/extensions-platform.controller.ts',
  'controllers/app-store-platform.controller.ts',
  'controllers/configuration-platform.controller.ts',
  'controllers/sdk-platform.controller.ts',
  'controllers/governance-platform.controller.ts',
  'controllers/monitoring-platform.controller.ts',
  'controllers/automation-platform.controller.ts',
];

const capabilities = [
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
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(
    JSON.stringify({ success: false, missing }, null, 2),
  );
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'platform-os-v2.types.ts'),
  'utf8',
);

const missingCapabilities = capabilities.filter(
  (capability) => !types.includes('${capability}'),
);

if (missingCapabilities.length > 0) {
  console.error(
    JSON.stringify(
      { success: false, missingCapabilities },
      null,
      2,
    ),
  );
  process.exit(1);
}

const appModule = fs.readFileSync(
  path.join(root, 'apps', 'api', 'src', 'app.module.ts'),
  'utf8',
);

if (!appModule.includes('PlatformOsV2Module')) {
  console.error(
    JSON.stringify(
      {
        success: false,
        reason: 'PlatformOsV2Module is not registered',
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const docs = [
  'docs/platform-os-v2/PLATFORM_OS_V2_ARCHITECTURE.md',
  'docs/platform-os-v2/capability-manifest.json',
  'docs/platform-os-v2/sdk-manifest.json',
];

const missingDocs = docs.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

if (missingDocs.length > 0) {
  console.error(
    JSON.stringify({ success: false, missingDocs }, null, 2),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: 'Mega System 1 — AVOS Platform OS',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      controllers: 11,
      services: 84,
      moduleRegistered: true,
      documentationReady: true,
      runtime: true,
      plugins: true,
      capabilitiesPlatform: true,
      extensions: true,
      appStore: true,
      configuration: true,
      sdk: true,
      governance: true,
      monitoring: true,
      automation: true,
    },
    null,
    2,
  ),
);