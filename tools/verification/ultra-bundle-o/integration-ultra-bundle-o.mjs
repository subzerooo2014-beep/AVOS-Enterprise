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
  governanceM,
  metadataM,
  lineageM,
  qualityM,
  fabricM,
  semanticM,
  graphGovernanceM,
  vaultM,
  discoveryM,
  orchestratorM,
  masterM,
  retentionM,
  accessM,
  sovereigntyM,
  dashboardM,
] = await Promise.all([
  load('enterprise-data-governance-engine.service.js'),
  load('metadata-catalog-intelligence.service.js'),
  load('data-lineage-intelligence.service.js'),
  load('data-quality-intelligence.service.js'),
  load('knowledge-fabric-engine.service.js'),
  load('enterprise-semantic-layer.service.js'),
  load('knowledge-graph-governance.service.js'),
  load('enterprise-memory-vault.service.js'),
  load('knowledge-discovery-engine.service.js'),
  load('enterprise-data-knowledge-orchestrator.service.js'),
  load('master-data-management-core.service.js'),
  load('memory-retention-policy-engine.service.js'),
  load('data-access-governance.service.js'),
  load('data-sovereignty-intelligence.service.js'),
  load('data-knowledge-dashboard.service.js'),
]);

const governance =
  new governanceM.EnterpriseDataGovernanceEngineService();
const metadata = new metadataM.MetadataCatalogIntelligenceService();
const lineage = new lineageM.DataLineageIntelligenceService();
const quality = new qualityM.DataQualityIntelligenceService();
const fabric = new fabricM.KnowledgeFabricEngineService();
const semantic = new semanticM.EnterpriseSemanticLayerService();
const graphGovernance =
  new graphGovernanceM.KnowledgeGraphGovernanceService();
const vault = new vaultM.EnterpriseMemoryVaultService();
const discovery = new discoveryM.KnowledgeDiscoveryEngineService();

const orchestrator =
  new orchestratorM.EnterpriseDataKnowledgeOrchestratorService(
    governance,
    metadata,
    lineage,
    quality,
    fabric,
    semantic,
    graphGovernance,
    vault,
    discovery,
  );

const assets = [
  {
    id: 'vehicle-master',
    name: 'Vehicle Master',
    domain: 'vehicles',
    owner: 'data-office',
    classification: 'internal',
    qualityScore: 90,
    freshnessMinutes: 20,
    region: 'uae',
  },
  {
    id: 'pricing-data',
    name: 'Pricing Data',
    domain: 'pricing',
    owner: 'pricing-team',
    classification: 'confidential',
    qualityScore: 84,
    freshnessMinutes: 45,
    region: 'uae',
  },
];

const entities = [
  {
    id: 'vehicle',
    type: 'business-entity',
    label: 'Vehicle',
    domain: 'vehicles',
    confidence: 0.95,
    attributes: {},
  },
  {
    id: 'price',
    type: 'business-entity',
    label: 'Price',
    domain: 'pricing',
    confidence: 0.9,
    attributes: {},
  },
];

const relations = [
  {
    id: 'relation-1',
    from: 'vehicle',
    to: 'price',
    relation: 'has-price',
    weight: 0.9,
  },
];

const result = orchestrator.run({
  assets,
  metadata: [
    {
      id: 'm1',
      assetId: 'vehicle-master',
      key: 'description',
      value: 'Canonical vehicle records',
      source: 'catalog',
    },
    {
      id: 'm2',
      assetId: 'vehicle-master',
      key: 'owner',
      value: 'data-office',
      source: 'catalog',
    },
    {
      id: 'm3',
      assetId: 'vehicle-master',
      key: 'retention',
      value: '7y',
      source: 'catalog',
    },
    {
      id: 'm4',
      assetId: 'pricing-data',
      key: 'description',
      value: 'Pricing intelligence',
      source: 'catalog',
    },
    {
      id: 'm5',
      assetId: 'pricing-data',
      key: 'owner',
      value: 'pricing-team',
      source: 'catalog',
    },
    {
      id: 'm6',
      assetId: 'pricing-data',
      key: 'retention',
      value: '5y',
      source: 'catalog',
    },
  ],
  lineage: [
    {
      id: 'lineage-1',
      fromAssetId: 'vehicle-master',
      toAssetId: 'pricing-data',
      transformation: 'valuation',
      confidence: 0.95,
    },
  ],
  entities,
  relations,
  memoryEntries: [
    {
      id: 'memory-1',
      category: 'decision',
      contentHash: 'hash-1',
      importance: 95,
      createdAt: new Date().toISOString(),
      legalHold: false,
    },
  ],
});

if (result.metadata.metadataCoverage !== 100) {
  throw new Error('Metadata coverage integration failed');
}

if (result.lineage.lineageCoverage !== 100) {
  throw new Error('Lineage coverage integration failed');
}

if (result.memoryVault.entries !== 1) {
  throw new Error('Memory vault integration failed');
}

const master = new masterM.MasterDataManagementCoreService();
const masterResult = master.resolve([
  {
    id: 'vehicle-1',
    entity: 'vehicle',
    sourceSystem: 'inventory',
    version: 1,
    confidence: 0.8,
    attributes: { vin: 'VIN-1' },
  },
  {
    id: 'vehicle-1',
    entity: 'vehicle',
    sourceSystem: 'catalog',
    version: 2,
    confidence: 0.95,
    attributes: { vin: 'VIN-1' },
  },
]);

if (masterResult.conflictCount !== 1) {
  throw new Error('Master data resolution failed');
}

const retention =
  new retentionM.MemoryRetentionPolicyEngineService();
const retentionResult = retention.evaluate([
  {
    id: 'memory-expired',
    category: 'temporary',
    contentHash: 'hash-expired',
    importance: 30,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() - 1000).toISOString(),
    legalHold: false,
  },
]);

if (retentionResult[0].action !== 'purge') {
  throw new Error('Memory retention policy failed');
}

const access = new accessM.DataAccessGovernanceService();
const accessResult = access.evaluate(
  assets[1],
  ['data-analyst'],
  [
    {
      id: 'access-policy',
      name: 'Confidential UAE access',
      allowedClassifications: ['confidential'],
      allowedRegions: ['uae'],
      requiredRoles: ['data-analyst'],
    },
  ],
);

if (!accessResult.allowed) {
  throw new Error('Data access governance failed');
}

const sovereignty =
  new sovereigntyM.DataSovereigntyIntelligenceService();
const sovereigntyResult = sovereignty.analyze(assets, {
  internal: ['uae'],
  confidential: ['uae'],
});

if (!sovereigntyResult.compliant) {
  throw new Error('Data sovereignty intelligence failed');
}

const dashboard = new dashboardM.DataKnowledgeDashboardService();
const snapshot = dashboard.snapshot({
  governanceScore: result.governance.governanceScore,
  dataQualityScore: result.quality.qualityScore,
  metadataCoverage: result.metadata.metadataCoverage,
  lineageCoverage: result.lineage.lineageCoverage,
  knowledgeGraphHealth: result.graphGovernance.graphHealth,
  memoryVaultHealth: result.memoryVault.healthScore,
});

if (Object.keys(snapshot.capabilityStatus).length !== 14) {
  throw new Error('Data knowledge dashboard capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle O compiled integration test',
      governanceScore: result.governance.governanceScore,
      dataQualityScore: result.quality.qualityScore,
      metadataCoverage: result.metadata.metadataCoverage,
      lineageCoverage: result.lineage.lineageCoverage,
      graphHealth: result.graphGovernance.graphHealth,
      memoryVaultHealth: result.memoryVault.healthScore,
      masterConflicts: masterResult.conflictCount,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);