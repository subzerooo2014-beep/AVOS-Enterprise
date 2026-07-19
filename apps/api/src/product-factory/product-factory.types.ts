export type FactoryStage =
  | 'requested'
  | 'planning'
  | 'integrating'
  | 'generating'
  | 'assembling'
  | 'validating'
  | 'testing'
  | 'certifying'
  | 'completed'
  | 'failed'
  | 'rolled-back';

export type ProductSurface =
  | 'api'
  | 'web'
  | 'mobile'
  | 'database'
  | 'worker'
  | 'documentation'
  | 'deployment'
  | 'tests';

export interface GovernanceEnvelope {
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
  approvedBy: string;
}

export interface FactoryTemplate {
  id: string;
  name: string;
  family: string;
  version: string;
  description: string;
  supportedSurfaces: ProductSurface[];
  defaultCapabilities: string[];
  defaultEntities: string[];
  policies: string[];
  governance: GovernanceEnvelope;
  createdAt: string;
}

export interface FactoryBuildRequest {
  templateId: string;
  marketplaceItemId?: string;
  marketplaceVersion?: string;
  productName: string;
  namespace: string;
  description: string;
  owner: string;
  jurisdiction: string;
  surfaces: ProductSurface[];
  capabilities: string[];
  entities: string[];
  integrations: string[];
  workflows: string[];
  features: string[];
  parameters: Record<string, unknown>;
  approvedBy: string;
}

export interface IntegrationSnapshot {
  capabilityFabric: Record<string, unknown>;
  knowledgeFabric: Record<string, unknown>;
  intelligenceFabric: Record<string, unknown>;
  marketplace: Record<string, unknown>;
  productTemplates: Record<string, unknown>;
  enterpriseKernel: Record<string, unknown>;
}

export interface FactoryBlueprint {
  id: string;
  buildId: string;
  productName: string;
  namespace: string;
  modules: string[];
  entities: string[];
  endpoints: string[];
  workflows: string[];
  integrations: string[];
  surfaces: ProductSurface[];
  qualityGates: string[];
  governance: GovernanceEnvelope;
  createdAt: string;
}

export interface FactoryArtifact {
  id: string;
  generator: string;
  type: string;
  surface: ProductSurface;
  relativePath: string;
  checksum: string;
  size: number;
  generatedAt: string;
}

export interface FactoryBuild {
  id: string;
  request: FactoryBuildRequest;
  stage: FactoryStage;
  progress: number;
  blueprint?: FactoryBlueprint;
  integrationSnapshot?: IntegrationSnapshot;
  artifacts: FactoryArtifact[];
  verification?: Record<string, unknown>;
  smoke?: Record<string, unknown>;
  certification?: Record<string, unknown>;
  errors: string[];
  governance: GovernanceEnvelope;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}