export type ClosureCheckStatus = 'passed' | 'failed' | 'warning';

export interface ClosureCheck {
  key: string;
  name: string;
  status: ClosureCheckStatus;
  score: number;
  required: boolean;
  details: string;
}

export interface ClosureReview {
  id: string;
  version: string;
  status: 'passed' | 'failed';
  score: number;
  checks: ClosureCheck[];
  blockingIssues: string[];
  warnings: string[];
  generatedAt: string;
}

export interface ProductionReadinessAssessment {
  id: string;
  status: 'ready' | 'not-ready';
  score: number;
  dimensions: {
    architecture: number;
    governance: number;
    learning: number;
    organization: number;
    execution: number;
    knowledge: number;
    operations: number;
    compliance: number;
    observability: number;
    recovery: number;
  };
  blockers: string[];
  recommendations: string[];
  generatedAt: string;
}

export interface PlatformClosureCertification {
  id: string;
  name: string;
  version: string;
  status: 'certified' | 'rejected';
  score: number;
  approvedBy: string;
  reviewId: string;
  readinessId: string;
  checks: {
    inventoryComplete: boolean;
    cognitiveGovernanceOperational: boolean;
    livingMemoryOperational: boolean;
    digitalOrganizationOperational: boolean;
    executionRuntimeOperational: boolean;
    knowledgeRuntimeOperational: boolean;
    autonomousOperationsOperational: boolean;
    humanFinalAuthority: boolean;
    livingVisionAlignment: boolean;
    globalComplianceReadinessGate: boolean;
    productionReadiness: boolean;
    noBlockingIssues: boolean;
  };
  certifiedAt: string;
}

export interface Pack6Status {
  name: string;
  version: string;
  status: 'operational';
  layer: 'Unified Platform Closure, Certification & Production Readiness';
  platformState:
    | 'awaiting-review'
    | 'reviewed'
    | 'ready-for-certification'
    | 'certified';
  latestReview?: ClosureReview;
  latestReadiness?: ProductionReadinessAssessment;
  latestCertification?: PlatformClosureCertification;
  controls: {
    unifiedCrossPackReview: true;
    architectureClosure: true;
    governanceClosure: true;
    learningClosure: true;
    organizationClosure: true;
    executionClosure: true;
    knowledgeClosure: true;
    operationsClosure: true;
    productionReadinessGate: true;
    humanFinalAuthority: true;
    globalComplianceReadinessGate: true;
    noCertificationWithBlockers: true;
    immutableCertificationEvidence: true;
  };
}