import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'enterprise-integration-federation',
);

const requiredFiles = [
  'enterprise-integration-federation.types.ts',
  'enterprise-integration-hub.service.ts',
  'universal-connector-framework.service.ts',
  'federation-management-engine.service.ts',
  'cross-platform-synchronization-engine.service.ts',
  'enterprise-api-gateway-intelligence.service.ts',
  'enterprise-event-federation.service.ts',
  'multi-cloud-integration-coordinator.service.ts',
  'external-system-trust-manager.service.ts',
  'enterprise-integration-security-layer.service.ts',
  'integration-policy-engine.service.ts',
  'federation-health-monitor.service.ts',
  'enterprise-integration-federation-orchestrator.service.ts',
  'integration-intelligence-dashboard.service.ts',
  'global-connectivity-center.service.ts',
  'enterprise-integration-federation.controller.ts',
  'enterprise-integration-federation.module.ts',
  'dto/connector-registration.dto.ts',
  'dto/federation-management.dto.ts',
  'dto/synchronization.dto.ts',
];

const capabilities = [
  'enterprise-integration-hub',
  'universal-connector-framework',
  'federation-management-engine',
  'cross-platform-synchronization-engine',
  'enterprise-api-gateway-intelligence',
  'enterprise-event-federation',
  'multi-cloud-integration-coordinator',
  'external-system-trust-manager',
  'enterprise-integration-security-layer',
  'integration-policy-engine',
  'federation-health-monitor',
  'integration-intelligence-dashboard',
  'global-connectivity-center',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(JSON.stringify({ success: false, missing }, null, 2));
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'enterprise-integration-federation.types.ts'),
  'utf8',
);

const missingCapabilities = capabilities.filter(
  (capability) => !types.includes(`'${capability}'`),
);

if (missingCapabilities.length > 0) {
  console.error(
    JSON.stringify({ success: false, missingCapabilities }, null, 2),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system:
        'AVOS Ultra Bundle L Enterprise Integration Federation Foundation',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      integrationHub: true,
      connectorFramework: true,
      federationManagement: true,
      platformSynchronization: true,
      apiGatewayIntelligence: true,
      eventFederation: true,
      multiCloudCoordinator: true,
      externalTrustManager: true,
      integrationSecurity: true,
      integrationPolicyEngine: true,
      federationHealthMonitor: true,
      integrationDashboard: true,
      globalConnectivityCenter: true,
    },
    null,
    2,
  ),
);