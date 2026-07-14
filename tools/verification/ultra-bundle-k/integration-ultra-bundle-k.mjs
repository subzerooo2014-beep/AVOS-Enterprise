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

      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.name === name) {
        return full;
      }
    }
  }

  throw new Error(`Compiled file not found: ${name}`);
}

async function load(name) {
  return import(pathToFileURL(findFile(name)));
}

const [
  ecosystemM,
  partnerM,
  collaborationM,
  integrationM,
  externalM,
  apiM,
  marketplaceM,
  federationM,
  trustM,
  lifecycleM,
  commandM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('global-ecosystem-intelligence-engine.service.js'),
  load('enterprise-partner-intelligence.service.js'),
  load('cross-organization-collaboration-engine.service.js'),
  load('global-integration-orchestrator.service.js'),
  load('external-intelligence-fusion-engine.service.js'),
  load('enterprise-api-intelligence-hub.service.js'),
  load('marketplace-intelligence-coordinator.service.js'),
  load('enterprise-federation-engine.service.js'),
  load('global-trust-identity-intelligence.service.js'),
  load('autonomous-partner-lifecycle-manager.service.js'),
  load('global-ecosystem-command-center.service.js'),
  load('global-ecosystem-orchestrator.service.js'),
  load('ecosystem-intelligence-dashboard.service.js'),
]);

const ecosystem =
  new ecosystemM.GlobalEcosystemIntelligenceEngineService();
const partners = new partnerM.EnterprisePartnerIntelligenceService();
const collaboration =
  new collaborationM.CrossOrganizationCollaborationEngineService();
const integration =
  new integrationM.GlobalIntegrationOrchestratorService();
const external =
  new externalM.ExternalIntelligenceFusionEngineService();
const api = new apiM.EnterpriseApiIntelligenceHubService();
const marketplace =
  new marketplaceM.MarketplaceIntelligenceCoordinatorService();
const federation = new federationM.EnterpriseFederationEngineService();
const trust = new trustM.GlobalTrustIdentityIntelligenceService();
const lifecycle =
  new lifecycleM.AutonomousPartnerLifecycleManagerService();
const commandCenter =
  new commandM.GlobalEcosystemCommandCenterService();

const orchestrator = new orchestratorM.GlobalEcosystemOrchestratorService(
  ecosystem,
  partners,
  collaboration,
  integration,
  external,
  api,
  marketplace,
  federation,
  trust,
  lifecycle,
  commandCenter,
);

const partnerRecords = [
  {
    id: 'partner-1',
    name: 'Payments Partner',
    region: 'uae',
    category: 'payments',
    trustScore: 92,
    performanceScore: 87,
    integrationScore: 90,
    status: 'active',
  },
  {
    id: 'partner-2',
    name: 'Logistics Partner',
    region: 'uae',
    category: 'logistics',
    trustScore: 85,
    performanceScore: 82,
    integrationScore: 78,
    status: 'active',
  },
];

const result = orchestrator.run({
  partners: partnerRecords,
  signals: [
    {
      id: 'signal-market',
      source: 'market-feed',
      domain: 'market',
      value: 84,
      confidence: 0.9,
      observedAt: new Date().toISOString(),
    },
    {
      id: 'signal-regulation',
      source: 'regulatory-feed',
      domain: 'regulation',
      value: 76,
      confidence: 0.85,
      observedAt: new Date().toISOString(),
    },
  ],
  endpoints: [
    {
      id: 'api-1',
      partnerId: 'partner-1',
      endpoint: '/payments',
      latencyMs: 120,
      errorRate: 2,
      throughput: 500,
      securityScore: 95,
    },
    {
      id: 'api-2',
      partnerId: 'partner-2',
      endpoint: '/logistics',
      latencyMs: 180,
      errorRate: 3,
      throughput: 300,
      securityScore: 90,
    },
  ],
  opportunities: [
    {
      id: 'opp-1',
      market: 'uae',
      category: 'vehicle-finance',
      demandScore: 92,
      supplyScore: 60,
      marginScore: 85,
      competitionScore: 40,
    },
  ],
  members: [
    {
      id: 'member-1',
      organization: 'Partner Federation One',
      region: 'uae',
      identityProvider: 'oidc',
      policyVersion: '1.0',
      trustScore: 90,
    },
  ],
  collaborationObjective: 'expand integrated mobility services',
});

if (result.commandCenter.total !== 2) {
  throw new Error('Ecosystem command center registration failed');
}

if (!result.integration.readyPartners.length) {
  throw new Error('Global integration orchestration failed');
}

if (!result.federation.acceptedMembers.length) {
  throw new Error('Enterprise federation failed');
}

const dashboard = new dashboardM.EcosystemIntelligenceDashboardService();
const snapshot = dashboard.snapshot({
  ecosystemHealth: result.ecosystem.ecosystemHealth,
  activePartners: result.ecosystem.activePartners,
  atRiskPartners: result.ecosystem.atRiskPartners.length,
  trustScore: result.trust.globalTrustScore,
  integrationHealth:
    result.integration.integrations.reduce(
      (sum, item) => sum + item.integrationHealth,
      0,
    ) / Math.max(1, result.integration.integrations.length),
  opportunityValue: result.marketplace[0]?.opportunityScore ?? 0,
});

if (Object.keys(snapshot.capabilityStatus).length !== 12) {
  throw new Error('Ecosystem dashboard capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle K compiled integration test',
      ecosystemHealth: result.ecosystem.ecosystemHealth,
      activePartners: result.ecosystem.activePartners,
      readyIntegrations: result.integration.readyPartners.length,
      federationMembers: result.federation.acceptedMembers.length,
      trustScore: result.trust.globalTrustScore,
      opportunityScore: result.marketplace[0].opportunityScore,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);