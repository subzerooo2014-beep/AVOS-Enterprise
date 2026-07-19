export type ProductLifecycleState =
  | 'draft'
  | 'built'
  | 'verified'
  | 'certified'
  | 'deployed'
  | 'running'
  | 'suspended'
  | 'retired'
  | 'failed'
  | 'rolled-back';

export type DeploymentEnvironment = 'development' | 'staging' | 'production';

export interface GovernanceEnvelope {
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
  approvedBy: string;
  jurisdiction: string;
}

export interface DeploymentRequest {
  namespace: string;
  version: string;
  packagePath: string;
  environment: DeploymentEnvironment;
  jurisdiction: string;
  approvedBy: string;
  port?: number;
  publishToMarketplace?: boolean;
}

export interface ProductRuntimeRecord {
  id: string;
  namespace: string;
  version: string;
  state: ProductLifecycleState;
  environment: DeploymentEnvironment;
  jurisdiction: string;
  packagePath: string;
  deploymentPath: string;
  port: number;
  processId?: number;
  health: 'unknown' | 'healthy' | 'degraded' | 'unhealthy';
  readiness: boolean;
  createdAt: string;
  updatedAt: string;
  governance: GovernanceEnvelope;
}

export interface EvolutionSignal {
  id: string;
  namespace: string;
  category:
    | 'usage'
    | 'performance'
    | 'security'
    | 'cost'
    | 'architecture-drift'
    | 'technical-debt'
    | 'crash';
  severity: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  evidence: string[];
  createdAt: string;
}

export interface EvolutionProposal {
  id: string;
  namespace: string;
  targetVersion: string;
  title: string;
  rationale: string[];
  changes: string[];
  risk: 'low' | 'medium' | 'high';
  requiresHumanApproval: true;
  approvedBy?: string;
  status: 'proposed' | 'approved' | 'rejected' | 'implemented';
  createdAt: string;
}

export interface ProductDigitalTwin {
  namespace: string;
  productDNA: Record<string, unknown>;
  productGenome: Record<string, unknown>;
  dependencyGraph: Record<string, unknown>;
  runtimeGraph: Record<string, unknown>;
  capabilityGraph: Record<string, unknown>;
  knowledgeGraph: Record<string, unknown>;
  scores: {
    trust: number;
    health: number;
    maturity: number;
    compliance: number;
  };
  updatedAt: string;
}

export interface MarketplaceRecord {
  id: string;
  namespace: string;
  version: string;
  status: 'pending-human-publication' | 'published' | 'suspended' | 'retired';
  packagePath: string;
  licensingModel: 'internal' | 'subscription' | 'usage' | 'enterprise';
  monetizationEnabled: boolean;
  multiTenantReady: boolean;
  globalComplianceReady: boolean;
  approvedBy?: string;
  publishedAt?: string;
}