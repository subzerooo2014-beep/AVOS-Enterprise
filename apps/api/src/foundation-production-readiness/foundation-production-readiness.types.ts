export const FOUNDATION_PRODUCTION_READINESS_CAPABILITIES = [
  'foundation-integrity-engine',
  'architecture-conformance-engine',
  'module-connectivity-verifier',
  'production-readiness-assessor',
  'security-readiness-auditor',
  'data-readiness-auditor',
  'operational-readiness-auditor',
  'dependency-health-analyzer',
  'release-gate-orchestrator',
  'end-to-end-foundation-validator',
  'foundation-evidence-registry',
  'production-readiness-dashboard',
  'foundation-completion-certificate',
] as const;

export type FoundationProductionReadinessCapability =
  (typeof FOUNDATION_PRODUCTION_READINESS_CAPABILITIES)[number];

export type ReadinessStatus =
  | 'ready'
  | 'conditional'
  | 'blocked';

export interface FoundationModule {
  id: string;
  name: string;
  domain: string;
  registered: boolean;
  buildPassing: boolean;
  testsPassing: boolean;
  verificationPassing: boolean;
  dependencies: string[];
}

export interface ReadinessCheck {
  id: string;
  category: string;
  name: string;
  passed: boolean;
  score: number;
  evidence: string[];
  blockers: string[];
}

export interface DependencyHealth {
  id: string;
  name: string;
  required: boolean;
  available: boolean;
  healthScore: number;
}

export interface ReleaseEvidence {
  id: string;
  category: string;
  description: string;
  path: string;
  verified: boolean;
  createdAt: string;
}

export interface FoundationCertificate {
  certificateId: string;
  system: string;
  branch: string;
  status: ReadinessStatus;
  score: number;
  issuedAt: string;
  capabilities: number;
  evidenceCount: number;
  blockers: string[];
}

export interface FoundationReadinessDashboardSnapshot {
  generatedAt: string;
  foundationScore: number;
  architectureScore: number;
  securityScore: number;
  dataScore: number;
  operationsScore: number;
  releaseStatus: ReadinessStatus;
  capabilityStatus: Record<
    FoundationProductionReadinessCapability,
    'operational'
  >;
}