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

const partnerM = await load('enterprise-partner-intelligence.service.js');
const externalM = await load('external-intelligence-fusion-engine.service.js');
const marketplaceM = await load(
  'marketplace-intelligence-coordinator.service.js',
);

const partners = new partnerM.EnterprisePartnerIntelligenceService();
const partnerResult = partners.evaluate([
  {
    id: 'partner-1',
    name: 'Partner One',
    region: 'uae',
    category: 'payments',
    trustScore: 90,
    performanceScore: 84,
    integrationScore: 88,
    status: 'active',
  },
]);

if (partnerResult.strongestPartner?.id !== 'partner-1') {
  throw new Error('Partner intelligence smoke test failed');
}

const external = new externalM.ExternalIntelligenceFusionEngineService();
const externalResult = external.fuse([
  {
    id: 'signal-1',
    source: 'market-feed',
    domain: 'market',
    value: 82,
    confidence: 0.9,
    observedAt: new Date().toISOString(),
  },
]);

if (externalResult.globalSignalStrength !== 82) {
  throw new Error('External intelligence fusion smoke test failed');
}

const marketplace =
  new marketplaceM.MarketplaceIntelligenceCoordinatorService();
const ranked = marketplace.rank([
  {
    id: 'opportunity-1',
    market: 'uae',
    category: 'vehicle-services',
    demandScore: 90,
    supplyScore: 55,
    marginScore: 80,
    competitionScore: 35,
  },
]);

if (ranked.length !== 1 || ranked[0].opportunityScore <= 0) {
  throw new Error('Marketplace intelligence smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle K compiled smoke test',
      strongestPartner: partnerResult.strongestPartner.id,
      globalSignalStrength: externalResult.globalSignalStrength,
      opportunityScore: ranked[0].opportunityScore,
    },
    null,
    2,
  ),
);