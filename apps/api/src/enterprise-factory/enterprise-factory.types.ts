export type FactoryStatus =
  | 'registered'
  | 'ready'
  | 'busy'
  | 'degraded'
  | 'suspended';

export type WorkOrderStatus =
  | 'planned'
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'awaiting-human-approval';

export interface EnterpriseFactoryRegistration {
  id: string;
  namespace: string;
  name: string;
  type: 'product-factory' | 'specialized-factory' | 'deployment-factory';
  status: FactoryStatus;
  capabilities: string[];
  capacity: number;
  activeWorkOrders: number;
  jurisdictions: string[];
  registeredAt: string;
}

export interface EnterprisePortfolio {
  id: string;
  namespace: string;
  name: string;
  strategy: string;
  products: string[];
  programs: string[];
  initiatives: string[];
  priority: number;
  owner: string;
  createdAt: string;
}

export interface EnterpriseResource {
  id: string;
  type: 'template' | 'code-library' | 'model' | 'environment' | 'compute' | 'data';
  name: string;
  capacity: number;
  allocated: number;
  tags: string[];
  status: 'available' | 'constrained' | 'unavailable';
  updatedAt: string;
}

export interface EnterpriseWorkOrder {
  id: string;
  namespace: string;
  portfolioNamespace: string;
  objective: string;
  requestedProducts: string[];
  priority: number;
  requiredCapabilities: string[];
  jurisdictions: string[];
  selectedFactoryIds: string[];
  status: WorkOrderStatus;
  approvedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterprisePlan {
  id: string;
  workOrderId: string;
  decomposition: Array<{
    productNamespace: string;
    purpose: string;
    capabilities: string[];
    recommendedStack: string[];
  }>;
  reuseCandidates: string[];
  risks: string[];
  confidence: number;
  requiresHumanApproval: true;
  createdAt: string;
}

export interface EnterpriseDeploymentRelease {
  id: string;
  workOrderId: string;
  environments: string[];
  strategy: 'rolling' | 'blue-green' | 'canary';
  releaseVersion: string;
  rollbackReady: boolean;
  status: 'prepared' | 'deployed' | 'rolled-back';
  approvedBy: string;
  createdAt: string;
}

export interface EnterpriseCertification {
  id: string;
  subject: string;
  subjectType: 'factory' | 'portfolio' | 'work-order' | 'release' | 'enterprise-factory';
  status: 'certified' | 'not-certified';
  score: number;
  checks: Array<{ name: string; passed: boolean }>;
  approvedBy: string;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
  createdAt: string;
}