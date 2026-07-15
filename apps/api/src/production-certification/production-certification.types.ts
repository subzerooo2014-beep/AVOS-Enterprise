export const PRODUCTION_CERTIFICATION_CAPABILITIES = [
  'security-certification-engine',
  'performance-certification-engine',
  'compliance-certification-engine',
  'load-test-certification-engine',
  'penetration-readiness-engine',
  'data-protection-certification-engine',
  'business-continuity-certification-engine',
  'release-candidate-engine',
  'quality-signoff-engine',
  'operations-signoff-engine',
  'security-signoff-engine',
  'executive-approval-engine',
  'release-evidence-registry',
  'production-certificate-engine',
  'certification-orchestrator',
  'production-certification-dashboard',
] as const;

export type ProductionCertificationCapability =
  (typeof PRODUCTION_CERTIFICATION_CAPABILITIES)[number];

export interface CertificationControl {
  id: string;
  domain: string;
  required: boolean;
  passed: boolean;
  evidence: string[];
}

export interface LoadTestResult {
  id: string;
  scenario: string;
  virtualUsers: number;
  requests: number;
  errorRate: number;
  p95LatencyMs: number;
  throughputPerSecond: number;
  passed: boolean;
}

export interface ComplianceRequirement {
  id: string;
  framework: string;
  title: string;
  required: boolean;
  compliant: boolean;
  evidence: string[];
}

export interface SignoffRecord {
  id: string;
  role: 'qa' | 'security' | 'operations' | 'cto' | 'executive';
  approved: boolean;
  approvedAt?: string;
  notes?: string;
}

export interface ReleaseCandidate {
  id: string;
  version: string;
  commitSha: string;
  buildPassed: boolean;
  testsPassed: boolean;
  securityPassed: boolean;
  performancePassed: boolean;
  compliancePassed: boolean;
  status: 'draft' | 'certified' | 'rejected';
}

export interface ProductionCertificate {
  id: string;
  releaseCandidateId: string;
  issuedAt: string;
  status: 'certified' | 'conditional' | 'rejected';
  score: number;
  approvals: string[];
  evidence: string[];
}

export interface ProductionCertificationDashboardSnapshot {
  generatedAt: string;
  securityScore: number;
  performanceScore: number;
  complianceScore: number;
  loadTestScore: number;
  signoffScore: number;
  certificationScore: number;
  releaseStatus: string;
  capabilityStatus: Record<
    ProductionCertificationCapability,
    'operational'
  >;
}