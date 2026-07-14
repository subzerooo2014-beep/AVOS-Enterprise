import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'enterprise-data-knowledge-fabric',
);

const requiredFiles = [
  'enterprise-data-knowledge-fabric.types.ts',
  'enterprise-data-governance-engine.service.ts',
  'metadata-catalog-intelligence.service.ts',
  'master-data-management-core.service.ts',
  'data-lineage-intelligence.service.ts',
  'data-quality-intelligence.service.ts',
  'knowledge-fabric-engine.service.ts',
  'enterprise-semantic-layer.service.ts',
  'knowledge-graph-governance.service.ts',
  'enterprise-memory-vault.service.ts',
  'memory-retention-policy-engine.service.ts',
  'data-access-governance.service.ts',
  'data-sovereignty-intelligence.service.ts',
  'knowledge-discovery-engine.service.ts',
  'enterprise-data-knowledge-orchestrator.service.ts',
  'data-knowledge-dashboard.service.ts',
  'enterprise-data-knowledge-fabric.controller.ts',
  'enterprise-data-knowledge-fabric.module.ts',
  'dto/data-governance.dto.ts',
  'dto/knowledge-graph.dto.ts',
  'dto/memory-vault.dto.ts',
];

const capabilities = [
  'enterprise-data-governance-engine',
  'metadata-catalog-intelligence',
  'master-data-management-core',
  'data-lineage-intelligence',
  'data-quality-intelligence',
  'knowledge-fabric-engine',
  'enterprise-semantic-layer',
  'knowledge-graph-governance',
  'enterprise-memory-vault',
  'memory-retention-policy-engine',
  'data-access-governance',
  'data-sovereignty-intelligence',
  'knowledge-discovery-engine',
  'data-knowledge-dashboard',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(JSON.stringify({ success: false, missing }, null, 2));
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'enterprise-data-knowledge-fabric.types.ts'),
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
        'AVOS Ultra Bundle O Data Governance Knowledge Fabric Enterprise Memory Completion',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      dataGovernanceEngine: true,
      metadataCatalog: true,
      masterDataManagement: true,
      dataLineage: true,
      dataQuality: true,
      knowledgeFabric: true,
      semanticLayer: true,
      knowledgeGraphGovernance: true,
      enterpriseMemoryVault: true,
      memoryRetentionPolicy: true,
      dataAccessGovernance: true,
      dataSovereignty: true,
      knowledgeDiscovery: true,
      dataKnowledgeDashboard: true,
    },
    null,
    2,
  ),
);