import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const distRoot = path.resolve('apps/api/dist');

function findFile(name) {
  const stack = [distRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.name === name) return full;
    }
  }
  throw new Error(`Compiled file not found: ${name}`);
}

async function load(name) {
  return import(pathToFileURL(findFile(name)));
}

const [
  hubM,
  frameworkM,
  federationM,
  syncM,
  gatewayM,
  eventM,
  cloudM,
  trustM,
  securityM,
  policyM,
  healthM,
  connectivityM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('enterprise-integration-hub.service.js'),
  load('universal-connector-framework.service.js'),
  load('federation-management-engine.service.js'),
  load('cross-platform-synchronization-engine.service.js'),
  load('enterprise-api-gateway-intelligence.service.js'),
  load('enterprise-event-federation.service.js'),
  load('multi-cloud-integration-coordinator.service.js'),
  load('external-system-trust-manager.service.js'),
  load('enterprise-integration-security-layer.service.js'),
  load('integration-policy-engine.service.js'),
  load('federation-health-monitor.service.js'),
  load('global-connectivity-center.service.js'),
  load('enterprise-integration-federation-orchestrator.service.js'),
  load('integration-intelligence-dashboard.service.js'),
]);

const hub = new hubM.EnterpriseIntegrationHubService();
const framework = new frameworkM.UniversalConnectorFrameworkService();
const federation = new federationM.FederationManagementEngineService();
const synchronization = new syncM.CrossPlatformSynchronizationEngineService();
const gateway = new gatewayM.EnterpriseApiGatewayIntelligenceService();
const events = new eventM.EnterpriseEventFederationService();
const cloud = new cloudM.MultiCloudIntegrationCoordinatorService();
const trust = new trustM.ExternalSystemTrustManagerService();
const security = new securityM.EnterpriseIntegrationSecurityLayerService();
const policy = new policyM.IntegrationPolicyEngineService();
const health = new healthM.FederationHealthMonitorService();
const connectivity = new connectivityM.GlobalConnectivityCenterService();

const orchestrator =
  new orchestratorM.EnterpriseIntegrationFederationOrchestratorService(
    hub,
    framework,
    federation,
    synchronization,
    gateway,
    events,
    cloud,
    trust,
    security,
    policy,
    health,
    connectivity,
  );

const connectors = [
  {
    id: 'connector-payments',
    name: 'Payments Connector',
    system: 'payments',
    protocol: 'rest',
    region: 'uae',
    trustScore: 92,
    healthScore: 88,
    latencyMs: 110,
    status: 'active',
  },
  {
    id: 'connector-logistics',
    name: 'Logistics Connector',
    system: 'logistics',
    protocol: 'graphql',
    region: 'ksa',
    trustScore: 86,
    healthScore: 82,
    latencyMs: 150,
    status: 'active',
  },
];

const nodes = [
  {
    id: 'node-1',
    organization: 'Federation One',
    region: 'uae',
    identityProvider: 'oidc',
    policyVersion: '1.0',
    trustScore: 90,
    healthScore: 88,
  },
];

const result = orchestrator.run({
  connectors,
  nodes,
  syncRecords: [
    {
      id: 'sync-customer',
      sourceSystem: 'crm',
      targetSystem: 'erp',
      entity: 'customer',
      sourceVersion: 5,
      targetVersion: 5,
      lastSynchronizedAt: new Date().toISOString(),
    },
  ],
  routes: [
    {
      id: 'route-payments',
      path: '/payments',
      target: 'payments-service',
      latencyMs: 120,
      errorRate: 2,
      securityScore: 95,
      throughput: 500,
    },
  ],
  events: [
    {
      id: 'event-1',
      source: 'crm',
      topic: 'customer.updated',
      version: 1,
      occurredAt: new Date().toISOString(),
      payloadHash: 'hash-1',
    },
  ],
  policies: [
    {
      id: 'policy-1',
      name: 'Default integration policy',
      minimumTrustScore: 70,
      maximumLatencyMs: 500,
      maximumErrorRate: 5,
      allowedProtocols: ['rest', 'graphql'],
    },
  ],
});

if (result.hub.active !== 2) {
  throw new Error('Integration hub orchestration failed');
}

if (!result.policy.compliant) {
  throw new Error(`Integration policy failed: ${result.policy.violations}`);
}

if (!result.federation.acceptedNodes.length) {
  throw new Error('Federation management failed');
}

const dashboard =
  new dashboardM.IntegrationIntelligenceDashboardService();
const snapshot = dashboard.snapshot({
  integrationHealth: result.gateway.gatewayHealth,
  activeConnectors: result.hub.active,
  federationHealth: result.federationHealth.health,
  synchronizationScore: result.synchronization.synchronizationScore,
  securityScore: result.security.securityScore,
  connectedRegions: result.connectivity.connectedRegions.length,
});

if (Object.keys(snapshot.capabilityStatus).length !== 13) {
  throw new Error('Integration dashboard capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle L compiled integration test',
      activeConnectors: result.hub.active,
      acceptedFederationNodes: result.federation.acceptedNodes.length,
      synchronizationScore: result.synchronization.synchronizationScore,
      gatewayHealth: result.gateway.gatewayHealth,
      securityScore: result.security.securityScore,
      connectedRegions: result.connectivity.connectedRegions.length,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);