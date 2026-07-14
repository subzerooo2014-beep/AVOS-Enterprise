import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'global-ecosystem-intelligence',
);

const requiredFiles = [
  'global-ecosystem-intelligence.types.ts',
  'global-ecosystem-intelligence-engine.service.ts',
  'enterprise-partner-intelligence.service.ts',
  'cross-organization-collaboration-engine.service.ts',
  'global-integration-orchestrator.service.ts',
  'external-intelligence-fusion-engine.service.ts',
  'enterprise-api-intelligence-hub.service.ts',
  'marketplace-intelligence-coordinator.service.ts',
  'enterprise-federation-engine.service.ts',
  'global-trust-identity-intelligence.service.ts',
  'autonomous-partner-lifecycle-manager.service.ts',
  'global-ecosystem-orchestrator.service.ts',
  'ecosystem-intelligence-dashboard.service.ts',
  'global-ecosystem-command-center.service.ts',
  'global-ecosystem-intelligence.controller.ts',
  'global-ecosystem-intelligence.module.ts',
  'dto/partner-intelligence.dto.ts',
  'dto/external-intelligence.dto.ts',
  'dto/marketplace-opportunity.dto.ts',
];

const capabilities = [
  'global-ecosystem-intelligence-engine',
  'enterprise-partner-intelligence',
  'cross-organization-collaboration-engine',
  'global-integration-orchestrator',
  'external-intelligence-fusion-engine',
  'enterprise-api-intelligence-hub',
  'marketplace-intelligence-coordinator',
  'enterprise-federation-engine',
  'global-trust-identity-intelligence',
  'autonomous-partner-lifecycle-manager',
  'ecosystem-intelligence-dashboard',
  'global-ecosystem-command-center',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(JSON.stringify({ success: false, missing }, null, 2));
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'global-ecosystem-intelligence.types.ts'),
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
        'AVOS Ultra Bundle K Enterprise Global Ecosystem External Intelligence',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      ecosystemIntelligenceEngine: true,
      partnerIntelligence: true,
      collaborationEngine: true,
      globalIntegrationOrchestrator: true,
      externalIntelligenceFusion: true,
      apiIntelligenceHub: true,
      marketplaceIntelligence: true,
      federationEngine: true,
      trustIdentityIntelligence: true,
      partnerLifecycleManager: true,
      ecosystemDashboard: true,
      ecosystemCommandCenter: true,
    },
    null,
    2,
  ),
);