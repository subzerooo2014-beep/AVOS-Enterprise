export const ENTERPRISE_DATA_KNOWLEDGE_FABRIC_CAPABILITIES = [
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
] as const;

export type EnterpriseDataKnowledgeFabricCapability =
  (typeof ENTERPRISE_DATA_KNOWLEDGE_FABRIC_CAPABILITIES)[number];

export interface DataAsset {
  id: string;
  name: string;
  domain: string;
  owner: string;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  qualityScore: number;
  freshnessMinutes: number;
  region: string;
}

export interface MetadataEntry {
  id: string;
  assetId: string;
  key: string;
  value: string;
  source: string;
}

export interface MasterRecord {
  id: string;
  entity: string;
  sourceSystem: string;
  version: number;
  confidence: number;
  attributes: Record<string, string | number | boolean>;
}

export interface DataLineageEdge {
  id: string;
  fromAssetId: string;
  toAssetId: string;
  transformation: string;
  confidence: number;
}

export interface KnowledgeEntity {
  id: string;
  type: string;
  label: string;
  domain: string;
  confidence: number;
  attributes: Record<string, string | number | boolean>;
}

export interface KnowledgeRelation {
  id: string;
  from: string;
  to: string;
  relation: string;
  weight: number;
}

export interface MemoryVaultEntry {
  id: string;
  category: string;
  contentHash: string;
  importance: number;
  createdAt: string;
  expiresAt?: string;
  legalHold: boolean;
}

export interface DataAccessPolicy {
  id: string;
  name: string;
  allowedClassifications: string[];
  allowedRegions: string[];
  requiredRoles: string[];
}

export interface DataKnowledgeDashboardSnapshot {
  generatedAt: string;
  governanceScore: number;
  dataQualityScore: number;
  metadataCoverage: number;
  lineageCoverage: number;
  knowledgeGraphHealth: number;
  memoryVaultHealth: number;
  capabilityStatus: Record<
    EnterpriseDataKnowledgeFabricCapability,
    'operational'
  >;
}