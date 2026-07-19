export type AvosPlatformDomainId =
  | 'runtime'
  | 'data'
  | 'ai'
  | 'workflow'
  | 'integration'
  | 'security'
  | 'operations'
  | 'product'
  | 'developer'
  | 'production-readiness'
  | 'final-certification';

export type AvosDomainStatus =
  | 'planned'
  | 'initializing'
  | 'operational'
  | 'degraded'
  | 'blocked'
  | 'certified';

export interface AvosPlatformDomain {
  id: AvosPlatformDomainId;
  name: string;
  phase: number;
  status: AvosDomainStatus;
  score: number;
  capabilities: string[];
  dependencies: AvosPlatformDomainId[];
  requiredForV1: boolean;
  humanFinalAuthority: boolean;
  globalComplianceReadinessGate: boolean;
  lastUpdatedAt: string;
}

export interface AvosVerificationCheck {
  name: string;
  passed: boolean;
  score: number;
  details: string;
}

export interface AvosVerificationReport {
  id: string;
  status: 'passed' | 'failed';
  score: number;
  checks: AvosVerificationCheck[];
  blockingFindings: string[];
  verifiedAt: string;
}

export interface AvosSmokeReport {
  id: string;
  status: 'passed' | 'failed';
  score: number;
  probes: Array<{
    name: string;
    passed: boolean;
    details: string;
  }>;
  testedAt: string;
}

export interface AvosV1Certification {
  id: string;
  status: 'certified' | 'not-certified';
  score: number;
  approvedBy: string;
  humanFinalAuthority: boolean;
  foundationFirst: boolean;
  capabilityFirst: boolean;
  blueprintDriven: boolean;
  globalComplianceReadinessGate: boolean;
  verificationId: string;
  smokeId: string;
  certifiedAt: string | null;
  reasons: string[];
}

export interface AvosRuntimeEvent {
  id: string;
  type: string;
  source: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}